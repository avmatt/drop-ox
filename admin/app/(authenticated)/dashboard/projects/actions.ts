"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db/db";
import { PROJECT_STATUS_VALUES, type ProjectStatus } from "./constants";

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function getOptionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getProjectStatus(formData: FormData): ProjectStatus {
  const value = formData.get("status");

  if (typeof value !== "string") {
    throw new Error("status is required");
  }

  if (!PROJECT_STATUS_VALUES.includes(value as ProjectStatus)) {
    throw new Error("status is invalid");
  }

  return value as ProjectStatus;
}

function getDateValue(formData: FormData, key: string) {
  const value = getRequiredText(formData, key);
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${key} is invalid`);
  }

  return parsed;
}

function getPayload(formData: FormData) {
  const endDateValue = getOptionalText(formData, "endDate");
  const parsedEndDate = endDateValue ? new Date(endDateValue) : null;

  if (endDateValue && Number.isNaN(parsedEndDate?.getTime() ?? NaN)) {
    throw new Error("endDate is invalid");
  }

  return {
    code: getRequiredText(formData, "code"),
    name: getRequiredText(formData, "name"),
    client: getRequiredText(formData, "client"),
    status: getProjectStatus(formData),
    summary: getRequiredText(formData, "summary"),
    description: getRequiredText(formData, "description"),
    startDate: getDateValue(formData, "startDate"),
    endDate: parsedEndDate,
  };
}

export async function createProjectAction(formData: FormData) {
  const payload = getPayload(formData);

  const created = await db.project.create({
    data: {
      ...payload,
      isActive: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${created.id}`);

  redirect(`/dashboard/projects/${created.id}`);
}

export async function updateProjectAction(formData: FormData) {
  const id = getRequiredText(formData, "id");
  const payload = getPayload(formData);
  const isActiveValue = formData.get("isActive");

  await db.project.update({
    where: { id },
    data: {
      ...payload,
      isActive: isActiveValue === "on",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);

  redirect(`/dashboard/projects/${id}`);
}

export async function deleteProjectAction(formData: FormData) {
  const id = getRequiredText(formData, "id");

  await db.project.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
