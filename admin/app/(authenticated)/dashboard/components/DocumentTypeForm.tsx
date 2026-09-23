"use client";

import { Button } from "ox-ui";
import { Card } from "ox-ui";
import { useRef, useState } from "react";

type DocumentTypeFormValues = {
  id?: string;
  kind: string;
  name: string;
  description: string;
  summary: string;
  validationNotes: string;
  structureHints: string[];
  requiredFields: string[];
  validationRules: string[];
  sampleKeywords: string[];
  isActive?: boolean;
};

type DocumentTypeFormProps = {
  title: string;
  description: string;
  submitLabel?: string;
  values?: DocumentTypeFormValues;
  action: (formData: FormData) => Promise<void>;
  includeIsActive?: boolean;
  readOnlyUntilEdit?: boolean;
};

const EMPTY_VALUES: DocumentTypeFormValues = {
  kind: "",
  name: "",
  description: "",
  summary: "",
  validationNotes: "",
  structureHints: [],
  requiredFields: [],
  validationRules: [],
  sampleKeywords: [],
  isActive: true,
};

const KIND_OPTIONS = [
  { value: "COI", label: "COI" },
  { value: "LIEN_WAIVER", label: "Lien Waiver" },
  { value: "INVOICE", label: "Invoice" },
  { value: "SUBMITTAL", label: "Submittal" },
  { value: "RFP", label: "RFP" },
  { value: "RFQ", label: "RFQ" },
];

function listToTextareaValue(items: string[]) {
  return items.join("\n");
}

export function DocumentTypeForm({
  title,
  description,
  submitLabel = "Save changes",
  values,
  action,
  includeIsActive = false,
  readOnlyUntilEdit = false,
}: DocumentTypeFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const initial = values ?? EMPTY_VALUES;
  const [isEditing, setIsEditing] = useState(!readOnlyUntilEdit);
  const hasKnownKind = KIND_OPTIONS.some((option) => option.value === initial.kind);

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
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">{description}</p>
        </div>

        {readOnlyUntilEdit && !isEditing ? (
          <Button
            key="edit"
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
                key="cancel"
                type="button"
                onClick={handleCancel}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
            ) : null}
            <Button
              key="save"
              type="submit"
            >
              {submitLabel}
            </Button>
          </div>
        )}
      </div>

      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Name
          <input
            name="name"
            required
            defaultValue={initial.name}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Kind
          <select
            name="kind"
            required
            defaultValue={initial.kind}
            disabled={!isEditing}
            className={inputClasses}
          >
            {!initial.kind ? <option value="">Select kind</option> : null}
            {!hasKnownKind && initial.kind ? (
              <option value={initial.kind}>{initial.kind}</option>
            ) : null}
            {KIND_OPTIONS.map((option) => (
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
          rows={3}
          defaultValue={initial.description}
          readOnly={!isEditing}
          className={inputClasses}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-zinc-700">
        Validation Notes
        <textarea
          name="validationNotes"
          required
          rows={2}
          defaultValue={initial.validationNotes}
          readOnly={!isEditing}
          className={inputClasses}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Structure Hints (one per line)
          <textarea
            name="structureHints"
            required
            rows={6}
            defaultValue={listToTextareaValue(initial.structureHints)}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Required Fields (one per line)
          <textarea
            name="requiredFields"
            required
            rows={6}
            defaultValue={listToTextareaValue(initial.requiredFields)}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Validation Rules (one per line)
          <textarea
            name="validationRules"
            required
            rows={6}
            defaultValue={listToTextareaValue(initial.validationRules)}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Sample Keywords (one per line)
          <textarea
            name="sampleKeywords"
            required
            rows={6}
            defaultValue={listToTextareaValue(initial.sampleKeywords)}
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
