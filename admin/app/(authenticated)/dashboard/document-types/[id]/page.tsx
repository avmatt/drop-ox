import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";
import { DocumentTypeForm } from "../../components/DocumentTypeForm";
import { DeleteDocumentTypeDialog } from "../components/DeleteDocumentTypeDialog";
import { deleteDocumentTypeAction, updateDocumentTypeAction } from "../actions";

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

type DocumentTypeDetailsPageProps = {
  params: { id: string };
};

export default async function DocumentTypeDetailsPage({ params }: DocumentTypeDetailsPageProps) {
  const { id } = params;
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
          { label: "Details" },
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
        <DeleteDocumentTypeDialog
          documentTypeId={documentType.id}
          action={deleteDocumentTypeAction}
        />
      </Card>
    </div>
  );
}
