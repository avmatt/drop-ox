import { notFound } from "next/navigation";

import { Breadcrumbs, Card, ConfirmationDialog } from "ox-ui";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";
import { DocumentTypeForm } from "../../components/DocumentTypeForm";
import { deleteDocumentTypeAction, updateDocumentTypeAction } from "../actions";

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

type DocumentTypeDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentTypeDetailsPage({
  params,
}: DocumentTypeDetailsPageProps) {
  const { id } = await params;
  const documentType = await db.documentType.findUnique({
    where: { id },
  });

  if (documentType === null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          Route.Dashboard,
          Route.DocumentTypes,
          { label: "Document Type Details" },
        ]}
      />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Configuration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Document Type Details
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Review and update this document type configuration.
        </p>
      </header>

      <DocumentTypeForm
        submitLabel="Save Changes"
        includeIsActive
        readOnlyUntilEdit
        action={updateDocumentTypeAction}
        values={{
          id: documentType.id,
          kind: documentType.kind,
          name: documentType.name,
          description: documentType.description,
          summary: documentType.summary,
          validationNotes: documentType.validationNotes,
          structureHints: toStringArray(documentType.structureHints),
          requiredFields: toStringArray(documentType.requiredFields),
          validationRules: toStringArray(documentType.validationRules),
          sampleKeywords: toStringArray(documentType.sampleKeywords),
          isActive: documentType.isActive,
        }}
      />

      <Card variant="danger">
        <p className="text-sm text-red-900">
          Deleting this document type is permanent and cannot be undone.
        </p>
        <ConfirmationDialog
          triggerLabel="Delete Document Type"
          title="Confirm Deletion"
          description="Deleting this document type is permanent and cannot be undone."
          confirmLabel="Confirm Delete"
          hiddenFields={[{ name: "id", value: documentType.id }]}
          action={deleteDocumentTypeAction}
          triggerClassName="mt-4 border-red-300 text-red-800 hover:bg-red-100"
        />
      </Card>
    </div>
  );
}
