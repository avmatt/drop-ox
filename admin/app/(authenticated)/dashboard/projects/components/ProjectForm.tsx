"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRef, useState } from "react";

import { PROJECT_STATUS_OPTIONS, type ProjectStatus } from "../constants";

type ProjectFormValues = {
  id?: string;
  code: string;
  name: string;
  client: string;
  status: ProjectStatus;
  summary: string;
  description: string;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
};

type ProjectFormProps = {
  title: string;
  description: string;
  submitLabel?: string;
  values?: ProjectFormValues;
  action: (formData: FormData) => Promise<void>;
  includeIsActive?: boolean;
  readOnlyUntilEdit?: boolean;
};

const EMPTY_VALUES: ProjectFormValues = {
  code: "",
  name: "",
  client: "",
  status: "PLANNING",
  summary: "",
  description: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

export function ProjectForm({
  title,
  description,
  submitLabel = "Save changes",
  values,
  action,
  includeIsActive = false,
  readOnlyUntilEdit = false,
}: ProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const initial = values ?? EMPTY_VALUES;
  const [isEditing, setIsEditing] = useState(!readOnlyUntilEdit);

  const handleCancel = () => {
    formRef.current?.reset();
    setIsEditing(false);
  };

  const inputClasses = `rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 ${
    !isEditing ? "bg-zinc-50" : "bg-white"
  }`;

  return (
    <Card>
      <form ref={formRef} action={action} className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{description}</p>
          </div>

          {readOnlyUntilEdit && !isEditing ? (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="sm"
            >
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {readOnlyUntilEdit ? (
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
              ) : null}
              <Button type="submit">{submitLabel}</Button>
            </div>
          )}
        </div>

        {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Project code
            <input
              name="code"
              required
              defaultValue={initial.code}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Project name
            <input
              name="name"
              required
              defaultValue={initial.name}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Client
            <input
              name="client"
              required
              defaultValue={initial.client}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Status
            <select
              name="status"
              required
              defaultValue={initial.status}
              disabled={!isEditing}
              className={inputClasses}
            >
              {PROJECT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Summary
          <input
            name="summary"
            required
            defaultValue={initial.summary}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Description
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={initial.description}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Start date
            <input
              type="date"
              name="startDate"
              required
              defaultValue={initial.startDate}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            End date
            <input
              type="date"
              name="endDate"
              defaultValue={initial.endDate ?? ""}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>
        </div>

        {includeIsActive ? (
          <label className="flex items-center gap-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial.isActive ?? true}
              disabled={!isEditing}
              className="h-4 w-4 rounded border-zinc-300"
            />
            Active
          </label>
        ) : null}
      </form>
    </Card>
  );
}
