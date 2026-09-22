import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";

import {
  deleteDocumentRequestAction,
  sendDocumentRequestAction,
  updateDocumentRequestAction,
} from "../actions";
import { DocumentRequestForm } from "../components/DocumentRequestForm";

type DocumentRequestDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function formatDateTime(value: Date | null) {
  if (value === null) {
    return "Not sent yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function DocumentRequestDetailsPage({ params }: DocumentRequestDetailsPageProps) {
  const { id } = await params;

  const documentRequest = await db.documentRequest.findUnique({
    where: { id },
    include: {
      project: true,
      requestedDocumentTypes: {
        include: {
          documentType: true,
        },
      },
    },
  });

  if (documentRequest === null) {
    notFound();
  }

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
          { label: documentRequest.recipientEmail },
        ]}
      />

      <DocumentRequestForm
        title="Document Request Details"
        description="Review and update the request sent to this recipient."
        submitLabel="Save Changes"
        includeSentAt
        readOnlyUntilEdit
        action={updateDocumentRequestAction}
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
        values={{
          id: documentRequest.id,
          projectId: documentRequest.projectId,
          recipientEmail: documentRequest.recipientEmail,
          recipientName: documentRequest.recipientName ?? "",
          status: documentRequest.status,
          message: documentRequest.message ?? "",
          selectedDocumentTypeIds: documentRequest.requestedDocumentTypes.map(
            (item) => item.documentTypeId,
          ),
        }}
      />

      <Card className="space-y-6 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Summary
            </p>
            <p className="mt-2 text-lg font-semibold text-zinc-900">
              {documentRequest.recipientEmail}
            </p>
            <p className="text-sm text-zinc-600">{documentRequest.project.name}</p>
          </div>

          <ConfirmationDialog
            triggerLabel="Send"
            title="Confirm Send"
            description={
              <>
                Send this document request to <span className="font-medium">{documentRequest.recipientEmail}</span>{" "}
                for <span className="font-medium">{documentRequest.project.name}</span>? This will email
                the request immediately.
              </>
            }
            confirmLabel="Confirm Send"
            hiddenFields={[{ name: "id", value: documentRequest.id }]}
            action={sendDocumentRequestAction}
          />
        </div>

        <p className="text-sm text-zinc-700">Sent at: {formatDateTime(documentRequest.sentAt)}</p>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
            Requested Documents
          </p>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700">Document Type</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Kind</th>
                <th className="px-4 py-3 font-semibold text-zinc-700">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {documentRequest.requestedDocumentTypes.map((item) => (
                <tr key={item.id} className="align-middle">
                  <td className="px-4 py-4 text-zinc-900">
                    <p className="font-semibold text-zinc-900">{item.documentType.name}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-600">{item.documentType.kind}</td>
                  <td className="px-4 py-4 text-zinc-600">Yes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </Card>

      <Card variant="danger">
        <p className="text-sm text-red-900">
          Deleting this document request is permanent and cannot be undone.
        </p>
        <ConfirmationDialog
          triggerLabel="Delete Request"
          title="Confirm Deletion"
          description="Deleting this document request is permanent and cannot be undone."
          confirmLabel="Confirm Delete"
          hiddenFields={[{ name: "id", value: documentRequest.id }]}
          action={deleteDocumentRequestAction}
          triggerClassName="mt-4 border-red-300 text-red-800 hover:bg-red-100"
        />
      </Card>
    </div>
  );
}
