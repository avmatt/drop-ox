import Link from "next/link";

import { DocumentTypeForm } from "../../components/DocumentTypeForm";
import { createDocumentTypeAction } from "../actions";

export default function NewDocumentTypePage() {
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
            New
          </li>
        </ol>
      </nav>

      <DocumentTypeForm
        title="Create Document Type"
        description="Add a new document type definition used for classification and validation."
        submitLabel="Create Document Type"
        action={createDocumentTypeAction}
      />
    </div>
  );
}
