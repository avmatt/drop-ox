"use client";

import { Button, Card } from "ox-ui";
import { useRef, useState } from "react";

import {
  DOCUMENT_REQUEST_STATUS_OPTIONS,
  type DocumentRequestStatus,
} from "../constants";

type DocumentRequestFormValues = {
  id?: string;
  projectId: string;
  recipientEmail: string;
  recipientName?: string;
  status: DocumentRequestStatus;
  message: string;
  selectedDocumentTypeIds: string[];
};

type DocumentRequestFormProps = {
  title: string;
  description: string;
  submitLabel?: string;
  values?: DocumentRequestFormValues;
  action: (formData: FormData) => Promise<void>;
  projects: readonly {
    id: string;
    code: string;
    name: string;
  }[];
  documentTypes: readonly {
    id: string;
    kind: string;
    name: string;
  }[];
  includeSentAt?: boolean;
  readOnlyUntilEdit?: boolean;
};

const EMPTY_VALUES: DocumentRequestFormValues = {
  projectId: "",
  recipientEmail: "",
  recipientName: "",
  status: "DRAFT",
  message: "",
  selectedDocumentTypeIds: [],
};

export function DocumentRequestForm({
  title,
  description,
  submitLabel = "Save changes",
  values,
  action,
  projects,
  documentTypes,
  includeSentAt = false,
  readOnlyUntilEdit = false,
}: DocumentRequestFormProps) {
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
                <Button type="button" onClick={handleCancel} variant="secondary" size="sm">
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
            Project
            <select
              name="projectId"
              required
              defaultValue={initial.projectId}
              disabled={!isEditing}
              className={inputClasses}
            >
              {!initial.projectId ? <option value="">Select project</option> : null}
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.code} - {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Recipient email
            <input
              name="recipientEmail"
              type="email"
              required
              defaultValue={initial.recipientEmail}
              readOnly={!isEditing}
              className={inputClasses}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Recipient name
            <input
              name="recipientName"
              defaultValue={initial.recipientName ?? ""}
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
              {DOCUMENT_REQUEST_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Message
          <textarea
            name="message"
            rows={4}
            defaultValue={initial.message}
            readOnly={!isEditing}
            className={inputClasses}
          />
        </label>

        {includeSentAt ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            Sent requests will automatically capture a sent timestamp when saved.
          </div>
        ) : null}

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Requested document types</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Select the document types this recipient must upload.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {documentTypes.map((documentType) => {
              const isChecked = initial.selectedDocumentTypeIds.includes(documentType.id);

              return (
                <label
                  key={documentType.id}
                  className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700"
                >
                  <input
                    type="checkbox"
                    name="documentTypeIds"
                    value={documentType.id}
                    defaultChecked={isChecked}
                    disabled={!isEditing}
                    className="mt-1 h-4 w-4 rounded border-zinc-300"
                  />
                  <span>
                    <span className="font-medium text-zinc-900">{documentType.name}</span>
                    <span className="block text-xs uppercase tracking-[0.08em] text-zinc-500">
                      {documentType.kind}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </form>
    </Card>
  );
}
