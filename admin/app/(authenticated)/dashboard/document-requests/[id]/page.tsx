import { notFound } from "next/navigation";

import { Breadcrumbs, Card, ConfirmationDialog } from "ox-ui";
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

function formatValidationData(value: unknown) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "Not available";
  }
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
          documents: {
            orderBy: [{ createdAt: "desc" }],
            select: {
              id: true,
              fileName: true,
              fileUrl: true,
              validationStatus: true,
              validationScore: true,
              validationNotes: true,
              extractedData: true,
              createdAt: true,
            },
          },
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
                <th className="px-4 py-3 font-semibold text-zinc-700">Validation Results</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {documentRequest.requestedDocumentTypes.map((item) => (
                <tr key={item.id} className="align-middle">
                  <td className="px-4 py-4 text-zinc-900">
                    <p className="font-semibold text-zinc-900">{item.documentType.name}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-600">{item.documentType.kind}</td>
                  <td className="px-4 py-4">
                    {item.documents.length === 0 ? (
                      <p className="text-zinc-600">No uploads yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {item.documents.map((document) => (
                          <div key={document.id} className="rounded-lg border border-zinc-200 p-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="font-medium text-zinc-900">{document.fileName}</span>
                              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                                {document.validationStatus}
                              </span>
                              {typeof document.validationScore === "number" ? (
                                <span className="text-xs text-zinc-600">
                                  Score: {document.validationScore}
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-1 text-xs text-zinc-500">
                              Uploaded: {formatDateTime(document.createdAt)}
                            </p>

                            {document.fileUrl ? (
                              <a
                                href={document.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 inline-block text-xs text-blue-600 underline"
                              >
                                Open uploaded file
                              </a>
                            ) : null}

                            {document.validationNotes ? (
                              <p className="mt-2 text-xs text-zinc-700">
                                <span className="font-medium">Notes:</span> {document.validationNotes}
                              </p>
                            ) : (
                              <p className="mt-2 text-xs text-zinc-500">No validation notes.</p>
                            )}

                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs font-medium text-zinc-700">
                                View extracted validation data
                              </summary>
                              <pre className="mt-2 max-h-48 overflow-auto rounded bg-zinc-50 p-2 text-[11px] text-zinc-700">
                                {formatValidationData(document.extractedData)}
                              </pre>
                            </details>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
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
