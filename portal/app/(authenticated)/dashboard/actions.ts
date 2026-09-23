"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db/db";
import { uploadDocumentToAzure } from "@/lib/storage/azure";

export async function uploadDocumentAction(formData: FormData) {
  const file = formData.get("file");
  const documentTypeId = formData.get("documentTypeId");
  const documentRequestId = formData.get("documentRequestId");
  const documentRequestDocumentTypeId = formData.get("documentRequestDocumentTypeId");
  const projectId = formData.get("projectId");

  if (!(file instanceof File)) {
    throw new Error("Please choose a file to upload.");
  }

  if (typeof documentTypeId !== "string" || documentTypeId.trim().length === 0) {
    throw new Error("Document type is required.");
  }

  if (typeof documentRequestId !== "string" || documentRequestId.trim().length === 0) {
    throw new Error("Document request is required.");
  }

  if (typeof documentRequestDocumentTypeId !== "string" || documentRequestDocumentTypeId.trim().length === 0) {
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
    throw new Error("A document has already been uploaded for this document type. Upload again only after it is rejected by an admin.");
  }

  const { url } = await uploadDocumentToAzure(file, "document-uploads");

  await db.document.create({
    data: {
      projectId,
      documentRequestId,
      documentRequestDocumentTypeId,
      documentTypeId,
      fileName: file.name,
      fileUrl: url,
      validationStatus: "PENDING",
    },
  });

  revalidatePath("/dashboard");
}
