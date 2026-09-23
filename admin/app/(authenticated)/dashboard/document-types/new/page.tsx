import { Breadcrumbs } from "ox-ui";
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

      <DocumentTypeForm
        title="Create Document Type"
        description="Add a new document type definition used for classification and validation."
        submitLabel="Create Document Type"
        action={createDocumentTypeAction}
      />
    </div>
  );
}
