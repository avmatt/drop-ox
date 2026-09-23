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

export default async function DocumentTypeDetailsPage({ params }: DocumentTypeDetailsPageProps) {
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
          { label: "Dashboard", href: Route.Dashboard },
          { label: "Document Types", href: Route.DocumentTypes },
          { label: documentType.name },
        ]}
      />

      <DocumentTypeForm
        title="Document Type Details"
        description="Review and edit this document type configuration."
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
