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

function getPayload(formData: FormData) {
  return {
    kind: getRequiredText(formData, "kind"),
    name: getRequiredText(formData, "name"),
    description: getRequiredText(formData, "description"),
    summary: getRequiredText(formData, "summary"),
    validationNotes: getRequiredText(formData, "validationNotes"),
    structureHints: parseStringList(
      getRequiredText(formData, "structureHints"),
    ),
    requiredFields: parseStringList(
      getRequiredText(formData, "requiredFields"),
    ),
    validationRules: parseStringList(
      getRequiredText(formData, "validationRules"),
    ),
    sampleKeywords: parseStringList(
      getRequiredText(formData, "sampleKeywords"),
    ),
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
