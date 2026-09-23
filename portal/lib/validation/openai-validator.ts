type OpenAiDocumentDefinition = {
  kind: string;
  name: string;
  requiredFields: string[];
  validationRules: string[];
  structureHints: string[];
  sampleKeywords: string[];
};

export type OpenAiValidationResult = {
  isValid: boolean;
  score: number;
  notes: string[];
};

type OpenAiResponseShape = {
  isCorrect?: boolean;
  isValidDocument?: boolean;
  isWellFormed?: boolean;
  score?: number;
  foundRequiredFields?: string[];
  missingRequiredFields?: string[];
  notes?: string[];
};

function clampScore(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return Math.round(value);
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function extractJsonObject(content: string) {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch && fencedMatch[1]) {
    return fencedMatch[1].trim();
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return content.slice(start, end + 1);
  }

  return content;
}

function normalizeForMatch(value: string) {
  return value.trim().toLowerCase();
}

function toCanonicalFieldNames(reference: string[], candidates: unknown) {
  const values = toStringArray(candidates);
  const referenceByLower = new Map(
    reference.map((field) => [normalizeForMatch(field), field]),
  );

  const matched = new Map<string, string>();
  for (const value of values) {
    const canonical = referenceByLower.get(normalizeForMatch(value));
    if (canonical) {
      matched.set(normalizeForMatch(canonical), canonical);
    }
  }

  return Array.from(matched.values());
}

export async function validateDocumentWithAzureOpenAi(
  extractedText: string,
  definition: OpenAiDocumentDefinition,
): Promise<OpenAiValidationResult> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error(
      "Azure OpenAI is enabled for this document type, but AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_API_KEY is missing.",
    );
  }

  const payload = {
    messages: [
      {
        role: "system",
        content:
          "You validate extracted document text for intake workflows. Matching for required fields, validation rules, structure hints, and keywords must be case-insensitive. Ignore minor punctuation and spacing differences when comparing text. Return ONLY valid JSON and do not include markdown.",
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: "Evaluate whether this document is correct, valid, and well-formed for the given document type definition.",
            response_schema: {
              isCorrect: "boolean",
              isValidDocument: "boolean",
              isWellFormed: "boolean",
              score: "integer from 0 to 100",
              foundRequiredFields: "string[]",
              missingRequiredFields: "string[]",
              notes: "string[] concise bullet-style findings",
            },
            documentType: definition,
            extractedText,
          },
          null,
          2,
        ),
      },
    ],
    temperature: 0,
    max_tokens: 900,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Azure OpenAI request failed: ${response.status} ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const rawContent = data.choices?.[0]?.message?.content?.trim();
  if (!rawContent) {
    throw new Error("Azure OpenAI returned an empty response.");
  }

  const jsonText = extractJsonObject(rawContent);
  let parsed: OpenAiResponseShape;

  try {
    parsed = JSON.parse(jsonText) as OpenAiResponseShape;
  } catch {
    throw new Error("Azure OpenAI response could not be parsed as JSON.");
  }

  const isCorrect = parsed.isCorrect === true;
  const isValidDocument = parsed.isValidDocument === true;
  const isWellFormed = parsed.isWellFormed === true;
  const requiredFields = toStringArray(definition.requiredFields);
  const foundRequiredFields = toCanonicalFieldNames(
    requiredFields,
    parsed.foundRequiredFields,
  );
  const aiMissingRequiredFields = toCanonicalFieldNames(
    requiredFields,
    parsed.missingRequiredFields,
  );
  const foundFieldSet = new Set(
    foundRequiredFields.map((field) => normalizeForMatch(field)),
  );
  const aiMissingFieldSet = new Set(
    aiMissingRequiredFields.map((field) => normalizeForMatch(field)),
  );
  const missingRequiredFields = requiredFields.filter(
    (field) =>
      aiMissingFieldSet.has(normalizeForMatch(field)) ||
      !foundFieldSet.has(normalizeForMatch(field)),
  );
  const modelNotes = toStringArray(parsed.notes);
  const score = clampScore(parsed.score);

  const notes: string[] = [
    `AI validation (Azure OpenAI): ${score}% confidence.`,
    isCorrect
      ? "AI check (correctness): passed."
      : `AI check (correctness): failed. Missing required fields: ${missingRequiredFields.join(", ") || "unknown"}.`,
    isValidDocument
      ? "AI check (document validity): passed."
      : "AI check (document validity): failed.",
    isWellFormed
      ? "AI check (well-formedness): passed."
      : "AI check (well-formedness): failed.",
  ];

  if (foundRequiredFields.length > 0) {
    notes.push(`AI found required fields: ${foundRequiredFields.join(", ")}.`);
  }

  if (missingRequiredFields.length > 0) {
    notes.push(`AI missing required fields: ${missingRequiredFields.join(", ")}.`);
  }

  notes.push(...modelNotes);

  return {
    isValid: isCorrect && isValidDocument && isWellFormed,
    score,
    notes,
  };
}
