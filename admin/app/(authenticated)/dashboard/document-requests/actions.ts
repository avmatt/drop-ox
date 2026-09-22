"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db/db";
import { sendEmail } from "@/lib/email/mailer";

import { DOCUMENT_REQUEST_STATUS_VALUES, type DocumentRequestStatus } from "./constants";

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function getOptionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (value === null || typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getDocumentRequestStatus(formData: FormData): DocumentRequestStatus {
  const value = formData.get("status");

  if (typeof value !== "string") {
    throw new Error("status is required");
  }

  if (!DOCUMENT_REQUEST_STATUS_VALUES.includes(value as DocumentRequestStatus)) {
    throw new Error("status is invalid");
  }

  return value as DocumentRequestStatus;
}

function getSelectedDocumentTypeIds(formData: FormData) {
  return formData
    .getAll("documentTypeIds")
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

function getPayload(formData: FormData) {
  const selectedDocumentTypeIds = getSelectedDocumentTypeIds(formData);

  if (selectedDocumentTypeIds.length === 0) {
    throw new Error("At least one document type is required");
  }

  const status = getDocumentRequestStatus(formData);

  return {
    projectId: getRequiredText(formData, "projectId"),
    recipientEmail: getRequiredText(formData, "recipientEmail"),
    recipientName: getOptionalText(formData, "recipientName"),
    status,
    message: getOptionalText(formData, "message"),
    sentAt: status === "SENT" ? new Date() : null,
    selectedDocumentTypeIds,
  };
}

function buildDocumentTypeCreates(documentTypeIds: string[]) {
  return documentTypeIds.map((documentTypeId) => ({ documentTypeId }));
}

async function getDocumentRequestEmailContent(documentRequestId: string) {
  const documentRequest = await db.documentRequest.findUnique({
    where: { id: documentRequestId },
    include: {
      project: true,
      requestedDocumentTypes: {
        include: {
          documentType: true,
        },
      },
    },
  });

  if (documentRequest === null) {
    throw new Error("Document request not found");
  }

  const documentTypeNames = documentRequest.requestedDocumentTypes
    .map((item) => item.documentType.name)
    .join(", ");

  const subject = `Document request for ${documentRequest.project.name}`;
  const text = [
    `Hello${documentRequest.recipientName ? ` ${documentRequest.recipientName}` : ""},`,
    "",
    `A new document request has been created for ${documentRequest.project.name}.`,
    `Requested documents: ${documentTypeNames}`,
    "",
    `If you have any questions, reply to this email at ${documentRequest.recipientEmail}.`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #18181b; line-height: 1.5;">
      <p>Hello${documentRequest.recipientName ? ` ${documentRequest.recipientName}` : ""},</p>
      <p>A new document request has been created for <strong>${documentRequest.project.name}</strong>.</p>
      <p><strong>Requested documents:</strong> ${documentTypeNames}</p>
      <p>If you have any questions, reply to this email at <a href="mailto:${documentRequest.recipientEmail}">${documentRequest.recipientEmail}</a>.</p>
    </div>
  `;

  return {
    documentRequest,
    subject,
    text,
    html,
  };
}

export async function createDocumentRequestAction(formData: FormData) {
  const payload = getPayload(formData);

  const created = await db.documentRequest.create({
    data: {
      projectId: payload.projectId,
      recipientEmail: payload.recipientEmail,
      recipientName: payload.recipientName,
      status: payload.status,
      message: payload.message,
      sentAt: payload.sentAt,
      requestedDocumentTypes: {
        create: buildDocumentTypeCreates(payload.selectedDocumentTypeIds),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/document-requests");
  revalidatePath(`/dashboard/document-requests/${created.id}`);

  redirect(`/dashboard/document-requests/${created.id}`);
}

export async function updateDocumentRequestAction(formData: FormData) {
  const id = getRequiredText(formData, "id");
  const payload = getPayload(formData);

  await db.documentRequest.update({
    where: { id },
    data: {
      projectId: payload.projectId,
      recipientEmail: payload.recipientEmail,
      recipientName: payload.recipientName,
      status: payload.status,
      message: payload.message,
      sentAt: payload.sentAt,
      requestedDocumentTypes: {
        deleteMany: {},
        create: buildDocumentTypeCreates(payload.selectedDocumentTypeIds),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/document-requests");
  revalidatePath(`/dashboard/document-requests/${id}`);

  redirect(`/dashboard/document-requests/${id}`);
}

export async function deleteDocumentRequestAction(formData: FormData) {
  const id = getRequiredText(formData, "id");

  await db.documentRequest.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/document-requests");
  redirect("/dashboard/document-requests");
}

export async function sendDocumentRequestAction(formData: FormData) {
  const id = getRequiredText(formData, "id");

  const { documentRequest, subject, text, html } = await getDocumentRequestEmailContent(id);

  await sendEmail({
    to: documentRequest.recipientEmail,
    subject,
    text,
    html,
  });

  await db.documentRequest.update({
    where: { id },
    data: {
      status: "SENT",
      sentAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/document-requests");
  revalidatePath(`/dashboard/document-requests/${id}`);

  redirect(`/dashboard/document-requests/${id}`);
}
