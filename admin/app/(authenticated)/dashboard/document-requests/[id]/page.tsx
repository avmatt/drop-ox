import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  Card,
  ConfirmationDialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "ox-ui";
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

function toValidationNotes(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    );
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  return [];
}

function getValidationStatusPillClasses(status: string) {
  const baseClasses =
    "rounded-full px-2 py-1 text-xs font-semibold";

  if (status === "VALID") {
    return `${baseClasses} bg-emerald-100 text-emerald-800`;
  }

  if (status === "INVALID") {
    return `${baseClasses} bg-red-100 text-red-800`;
  }

  return `${baseClasses} bg-amber-100 text-amber-800`;
}

export default async function DocumentRequestDetailsPage({
  params,
}: DocumentRequestDetailsPageProps) {
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
    db.documentType.findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          Route.Dashboard,
          Route.DocumentRequests,
          { label: "Request Details" },
        ]}
      />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Requests
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Document Request Details
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Review and update the request sent to this recipient.
        </p>
      </header>

      <DocumentRequestForm
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
            <Text variant="primary" size="lg" as="div">
              {documentRequest.recipientEmail}
            </Text>
            <p>{documentRequest.project.name}</p>
          </div>

          <ConfirmationDialog
            triggerLabel="Send"
            title="Confirm Send"
            description={
              <>
                Send this document request to{" "}
                <span className="font-medium">
                  {documentRequest.recipientEmail}
                </span>{" "}
                for{" "}
                <span className="font-medium">
                  {documentRequest.project.name}
                </span>
                ? This will email the request immediately.
              </>
            }
            confirmLabel="Confirm Send"
            hiddenFields={[{ name: "id", value: documentRequest.id }]}
            action={sendDocumentRequestAction}
          />
        </div>

        <div>
          <Text variant="secondary" size="xs">
            Sent at
          </Text>
          <div>{formatDateTime(documentRequest.sentAt)}</div>
        </div>

        <div>
          <Text variant="secondary" size="xs" className="mb-2">
            Requested Documents
          </Text>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Document Type</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documentRequest.requestedDocumentTypes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-zinc-900 align-top">
                      {item.documentType.name}
                      <Text variant="secondary" size="xs">
                        {item.documentType.kind}
                      </Text>
                    </TableCell>
                    <TableCell>
                      {item.documents.length === 0 ? (
                        <p className="text-zinc-600">No uploads yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {item.documents.map((document) =>
                            (() => {
                              const validationNotes = toValidationNotes(
                                document.validationNotes,
                              );
                              const extractedContent =
                                typeof document.extractedData === "string"
                                  ? document.extractedData.trim()
                                  : "";

                              return (
                                <div
                                  key={document.id}
                                  className="rounded-lg border border-zinc-200 p-3"
                                >
                                  <div className="flex justify-between gap-2 text-sm">
                                    <span className="font-medium text-zinc-900">
                                      {document.fileName}
                                    </span>
                                    <div>
                                      <span
                                        className={getValidationStatusPillClasses(
                                          document.validationStatus,
                                        )}
                                      >
                                        {document.validationStatus}
                                      </span>
                                    </div>
                                  </div>

                                  <hr className="my-2 border-zinc-200" />

                                  <p className="mt-1 text-xs text-zinc-500">
                                    Uploaded:{" "}
                                    {formatDateTime(document.createdAt)}
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

                                  

                                  <hr className="my-2 border-zinc-200" />

                                  {validationNotes.length > 0 && (
                                    <ul className="list-disc list-inside text-xs text-zinc-500">
                                        {validationNotes.map((note, index) => (
                                          <li key={`${document.id}-note-${index}`}>{note}</li>
                                        ))}
                                    </ul>
                                  )}

                                  <details className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-2">
                                    <summary className="cursor-pointer text-xs font-medium text-zinc-700">
                                      View extracted content
                                    </summary>
                                    <div className="mt-2 max-h-64 overflow-auto rounded bg-white p-2">
                                      <pre className="whitespace-pre-wrap break-words text-xs text-zinc-700">
                                        {extractedContent.length > 0
                                          ? extractedContent
                                          : "No extracted content available."}
                                      </pre>
                                    </div>
                                  </details>
                                </div>
                              );
                            })(),
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
