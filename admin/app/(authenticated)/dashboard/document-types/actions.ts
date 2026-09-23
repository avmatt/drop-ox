"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db/db";

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function parseStringList(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function getOptionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getRequiredPositiveInt(formData: FormData, key: string) {
  const value = getRequiredText(formData, key);
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive number`);
  }

  return parsed;
}

function getPayload(formData: FormData) {
  const useAi = formData.get("useAi") === "on";

  return {
    kind: getRequiredText(formData, "kind"),
    name: getRequiredText(formData, "name"),
    description: getRequiredText(formData, "description"),
    summary: getRequiredText(formData, "summary"),
    validationNotes: getRequiredText(formData, "validationNotes"),
    structureHints: useAi
      ? parseStringList(getOptionalText(formData, "structureHints"))
      : [],
    requiredFields: parseStringList(
      getRequiredText(formData, "requiredFields"),
    ),
    validationRules: useAi
      ? parseStringList(getOptionalText(formData, "validationRules"))
      : [],
    sampleKeywords: useAi
      ? parseStringList(getOptionalText(formData, "sampleKeywords"))
      : [],
    acceptedFileTypes: parseStringList(
      getRequiredText(formData, "acceptedFileTypes"),
    ),
    acceptedFileExtensions: parseStringList(
      getRequiredText(formData, "acceptedFileExtensions"),
    ),
    maxFileSizeMb: getRequiredPositiveInt(formData, "maxFileSizeMb"),
    useAi,
  };
}

export async function createDocumentTypeAction(formData: FormData) {
  const payload = getPayload(formData);

  const created = await db.documentType.create({
    data: {
      ...payload,
      isActive: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/document-types");
  revalidatePath(`/dashboard/document-types/${created.id}`);

  redirect(`/dashboard/document-types/${created.id}`);
}

export async function updateDocumentTypeAction(formData: FormData) {
  const id = getRequiredText(formData, "id");
  const payload = getPayload(formData);
  const isActiveValue = formData.get("isActive");

  await db.documentType.update({
    where: { id },
    data: {
      ...payload,
      isActive: isActiveValue === "on",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/document-types`);
  revalidatePath(`/dashboard/document-types/${id}`);

  redirect(`/dashboard/document-types/${id}`);
}

export async function deleteDocumentTypeAction(formData: FormData) {
  const id = getRequiredText(formData, "id");

  await db.documentType.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/document-types");
  redirect("/dashboard/document-types");
}
