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
          Route.Dashboard,
          Route.DocumentRequests,
          { label: "New" },
        ]}
      />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Requests
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          New Document Request
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Select a project, choose the required document types, and send the request to a recipient email address.
        </p>
      </header>

      <DocumentRequestForm
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
