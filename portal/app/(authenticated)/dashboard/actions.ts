"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db/db";
import { uploadDocumentToAzure } from "@/lib/storage/azure";
import { extractTextFromFile } from "@/lib/validation/extractor";
import { validateDocumentAgainstType } from "@/lib/validation/validator";

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export async function uploadDocumentAction(formData: FormData) {
  const file = formData.get("file");
  const documentTypeId = formData.get("documentTypeId");
  const documentRequestId = formData.get("documentRequestId");
  const documentRequestDocumentTypeId = formData.get(
    "documentRequestDocumentTypeId",
  );
  const projectId = formData.get("projectId");

  if (!(file instanceof File)) {
    throw new Error("Please choose a file to upload.");
  }

  if (
    typeof documentTypeId !== "string" ||
    documentTypeId.trim().length === 0
  ) {
    throw new Error("Document type is required.");
  }

  if (
    typeof documentRequestId !== "string" ||
    documentRequestId.trim().length === 0
  ) {
    throw new Error("Document request is required.");
  }

  if (
    typeof documentRequestDocumentTypeId !== "string" ||
    documentRequestDocumentTypeId.trim().length === 0
  ) {
    throw new Error("Document request type link is required.");
  }

  if (typeof projectId !== "string" || projectId.trim().length === 0) {
    throw new Error("Project is required.");
  }

  if (file.size === 0) {
    throw new Error("Selected file is empty.");
  }

  const existingActiveDocument = await db.document.findFirst({
    where: {
      documentRequestDocumentTypeId,
      validationStatus: {
        not: "INVALID",
      },
    },
  });

  if (existingActiveDocument) {
    throw new Error(
      "A document has already been uploaded for this document type. Upload again only after it is rejected by an admin.",
    );
  }

  const documentType = await db.documentType.findUnique({
    where: { id: documentTypeId },
    select: {
      kind: true,
      name: true,
      requiredFields: true,
      validationRules: true,
      sampleKeywords: true,
    },
  });

  if (!documentType) {
    throw new Error("Document type could not be found.");
  }

  const { url } = await uploadDocumentToAzure(file);
  const extractedText = await extractTextFromFile(file);
  const validationResult = validateDocumentAgainstType(
    {
      name: documentType.name,
      requiredFields: toStringArray(documentType.requiredFields),
    },
    {
      name: file.name,
      type: file.type,
      size: file.size,
      text: extractedText,
    },
  );

  await db.document.create({
    data: {
      projectId,
      documentRequestId,
      documentRequestDocumentTypeId,
      documentTypeId,
      fileName: file.name,
      fileUrl: url,
      extractedData: validationResult.extractedData,
      validationStatus: validationResult.status,
      validationNotes: validationResult.notes.join(" "),
    },
  });

  revalidatePath("/dashboard");
}
