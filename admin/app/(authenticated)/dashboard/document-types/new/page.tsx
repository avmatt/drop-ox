import { Breadcrumbs } from "@drop-ox/ox-ui";
import { Route } from "@/lib/routes";
import { DocumentTypeForm } from "../../components/DocumentTypeForm";
import { createDocumentTypeAction } from "../actions";

export default function NewDocumentTypePage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          Route.Dashboard,
          Route.DocumentTypes,
          { label: "New" },
        ]}
      />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Configuration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          New Document Type
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Add a new document type definition used for classification and validation.
        </p>
      </header>

      <DocumentTypeForm
        submitLabel="Create Document Type"
        action={createDocumentTypeAction}
      />
    </div>
  );
}
