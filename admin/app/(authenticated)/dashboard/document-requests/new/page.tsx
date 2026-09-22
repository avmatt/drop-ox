import { Breadcrumbs } from "ox-ui";
import { Route } from "@/lib/routes";
import { db } from "@/lib/db/db";

import { createDocumentRequestAction } from "../actions";
import { DocumentRequestForm } from "../components/DocumentRequestForm";

export default async function NewDocumentRequestPage() {
  const [projects, documentTypes] = await Promise.all([
    db.project.findMany({ orderBy: [{ isActive: "desc" }, { name: "asc" }] }),
    db.documentType.findMany({ orderBy: [{ isActive: "desc" }, { name: "asc" }] }),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: Route.Dashboard },
          { label: "Document Requests", href: Route.DocumentRequests },
          { label: "New" },
        ]}
      />

      <DocumentRequestForm
        title="Create Document Request"
        description="Select a project, choose the required document types, and send the request to a recipient email address."
        submitLabel="Create Request"
        action={createDocumentRequestAction}
        projects={projects.map((project) => ({
          id: project.id,
          code: project.code,
          name: project.name,
        }))}
        documentTypes={documentTypes.map((documentType) => ({
          id: documentType.id,
          kind: documentType.kind,
          name: documentType.name,
        }))}
      />
    </div>
  );
}
