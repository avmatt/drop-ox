"use client";

import { Button } from "ox-ui";
import { Card } from "ox-ui";
import { useRef, useState } from "react";

function RequiredLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      <span aria-label="required" className="text-red-500">
        *
      </span>
    </span>
  );
}

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
  acceptedFileTypes: string[];
  acceptedFileExtensions: string[];
  maxFileSizeMb: number;
  useAi: boolean;
  isActive?: boolean;
};

type DocumentTypeFormProps = {
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
  acceptedFileTypes: ["application/pdf", "application/msword", "image/png", "image/jpeg"],
  acceptedFileExtensions: ["pdf", "doc", "docx", "png", "jpg", "jpeg"],
  maxFileSizeMb: 10,
  useAi: true,
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
  submitLabel = "Save changes",
  values,
  action,
  includeIsActive = false,
  readOnlyUntilEdit = false,
}: DocumentTypeFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const initial = values ?? EMPTY_VALUES;
  const [isEditing, setIsEditing] = useState(!readOnlyUntilEdit);
  const [useAiEnabled, setUseAiEnabled] = useState(initial.useAi);
  const hasKnownKind = KIND_OPTIONS.some(
    (option) => option.value === initial.kind,
  );

  const handleCancel = () => {
    formRef.current?.reset();
    setUseAiEnabled(initial.useAi);
    setIsEditing(false);
  };

  const inputClasses = `rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 ${
    !isEditing ? "bg-zinc-50" : "bg-white"
  }`;

  const aiFieldClasses = `rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 ${
    !isEditing || !useAiEnabled ? "bg-zinc-50" : "bg-white"
  }`;

  return (
    <Card>
      <form ref={formRef} action={action} className="space-y-6">
        <div className="flex items-start justify-end -mb-2">
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
              <Button type="submit" size="sm">
                {submitLabel}
              </Button>
            </div>
          )}
        </div>

        {initial.id ? (
          <input type="hidden" name="id" value={initial.id} />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            <RequiredLabel label="Name" />
            <input
              name="name"
              required
              defaultValue={initial.name}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            <RequiredLabel label="Kind" />
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
          <RequiredLabel label="Summary" />
          <input
            name="summary"
            required
            defaultValue={initial.summary}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          <RequiredLabel label="Description" />
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
          <RequiredLabel label="Validation Notes" />
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
            <RequiredLabel label="Accepted File Types (one per line)" />
            <textarea
              name="acceptedFileTypes"
              required
              rows={4}
              defaultValue={listToTextareaValue(initial.acceptedFileTypes)}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            <RequiredLabel label="Accepted File Extensions (one per line)" />
            <textarea
              name="acceptedFileExtensions"
              required
              rows={4}
              defaultValue={listToTextareaValue(initial.acceptedFileExtensions)}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            <RequiredLabel label="Max File Size (MB)" />
            <input
              type="number"
              name="maxFileSizeMb"
              required
              min={1}
              step={1}
              defaultValue={initial.maxFileSizeMb}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          <RequiredLabel label="Required Fields (one per line)" />
          <textarea
            name="requiredFields"
            required
            rows={6}
            defaultValue={listToTextareaValue(initial.requiredFields)}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        <hr className="my-4 border-zinc-300" />
        <label className="flex items-center gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="useAi"
            defaultChecked={initial.useAi}
            disabled={!isEditing}
            onChange={(event) => setUseAiEnabled(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          Use AI to validate and enhance document processing
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          <span>Validation Rules (one per line)</span>
          <textarea
            name="validationRules"
            rows={6}
            defaultValue={listToTextareaValue(initial.validationRules)}
            readOnly={!isEditing || !useAiEnabled}
            disabled={!isEditing || !useAiEnabled}
            className={aiFieldClasses}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            <span>Structure Hints (one per line)</span>
            <textarea
              name="structureHints"
              rows={6}
              defaultValue={listToTextareaValue(initial.structureHints)}
              readOnly={!isEditing || !useAiEnabled}
              disabled={!isEditing || !useAiEnabled}
              className={aiFieldClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            <span>Sample Keywords (one per line)</span>
            <textarea
              name="sampleKeywords"
              rows={6}
              defaultValue={listToTextareaValue(initial.sampleKeywords)}
              readOnly={!isEditing || !useAiEnabled}
              disabled={!isEditing || !useAiEnabled}
              className={aiFieldClasses}
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
