import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db/db";
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
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard" className="font-medium text-zinc-700 transition hover:text-zinc-900">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">
            /
          </li>
          <li>
            <Link
              href="/dashboard/document-types"
              className="font-medium text-zinc-700 transition hover:text-zinc-900"
            >
              Document Types
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">
            /
          </li>
          <li className="font-semibold text-zinc-900" aria-current="page">
            Details
          </li>
        </ol>
      </nav>

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

      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-900">
          Deleting this document type is permanent and cannot be undone.
        </p>
        <DeleteDocumentTypeDialog
          documentTypeId={documentType.id}
          action={deleteDocumentTypeAction}
        />
      </section>
    </div>
  );
}
