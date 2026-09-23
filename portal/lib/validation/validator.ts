export type DocumentType = {
  name: string;
  requiredFields: string[];
  acceptedFileTypes: string[];
  acceptedFileExtensions: string[];
  maxFileSizeMb: number;
};

export type DocumentValidationResult = {
  status: "VALID" | "PENDING" | "INVALID";
  notes: string[];
  extractedData: string;
};

function normalizeFileExtensions(extensions: string[]) {
  return extensions
    .map((extension) => extension.trim().toLowerCase())
    .filter((extension) => extension.length > 0)
    .map((extension) => (extension.startsWith(".") ? extension.slice(1) : extension));
}

export function validateDocumentAgainstType(
  definition: DocumentType,
  file: {
    name: string;
    type: string;
    size: number;
    text: string;
  },
): DocumentValidationResult {
  const fileName = (file.name ?? "document").trim();
  const fileType = (file.type ?? "application/octet-stream").toLowerCase();
  const fileSize = typeof file.size === "number" ? file.size : 0;
  const extractedData = file.text ?? "";
  const fileExtension = fileName.includes(".")
    ? (fileName.split(".").pop()?.toLowerCase() ?? "")
    : "";

  const acceptedMimeTypes = new Set(
    definition.acceptedFileTypes
      .map((mimeType) => mimeType.trim().toLowerCase())
      .filter((mimeType) => mimeType.length > 0),
  );
  const acceptedExtensions = new Set(
    normalizeFileExtensions(definition.acceptedFileExtensions),
  );
  const maxFileSizeBytes = Math.max(definition.maxFileSizeMb, 1) * 1024 * 1024;

  const isSupportedFileType =
    acceptedMimeTypes.has(fileType) || acceptedExtensions.has(fileExtension);
  const isWithinSizeLimit = fileSize > 0 && fileSize <= maxFileSizeBytes;

  const requiredFields = definition.requiredFields;
  const lowerCaseExtractedData = extractedData.toLowerCase();
  const presentRequiredFields = requiredFields.filter((fieldName) =>
    lowerCaseExtractedData.includes(fieldName.toLowerCase()),
  );
  const missingRequiredFields = requiredFields.filter(
    (fieldName) => !presentRequiredFields.includes(fieldName),
  );

  let status: DocumentValidationResult["status"] = "VALID";
  const notes: string[] = [];
  if (isSupportedFileType) {
    notes.push(
      `The uploaded file is a supported format for ${definition.name}.`,
    );
  } else {
    notes.push(
      `The uploaded file type is not supported for ${definition.name}.`,
    );
    status = "INVALID";
  }

  if (isWithinSizeLimit) {
    notes.push(`The file is within the ${definition.maxFileSizeMb}MB upload limit.`);
  } else {
    notes.push(`The file exceeds the ${definition.maxFileSizeMb}MB upload limit.`);
    status = "INVALID";
  }

  notes.push(`Extracted text length: ${extractedData.trim().length} characters.`);

  if (extractedData.trim().length === 0) {
    notes.push(
      "No machine-readable text was extracted from this file. The document may be image-only or low quality.",
    );
  }

  if (requiredFields.length > 0) {
    notes.push(
      `Required field validation: ${presentRequiredFields.length}/${requiredFields.length} fields were found in the uploaded document.`,
    );

    notes.push(
      presentRequiredFields.length > 0
        ? `Fields found: ${presentRequiredFields.join(", ")}.`
        : "Fields found: none.",
    );

    notes.push(
      missingRequiredFields.length > 0
        ? `Fields not found: ${missingRequiredFields.join(", ")}.`
        : "Fields not found: none.",
    );

    if (missingRequiredFields.length > 0) {
      status = "INVALID";
    }
  }

  return {
    status,
    notes,
    extractedData,
  };
}
