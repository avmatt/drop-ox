import { headers } from "next/headers";
import {
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "ox-ui";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";

import { uploadDocumentAction } from "./actions";
import { redirect } from "next/navigation";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

function toValidationNotes(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  return [];
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(Route.SignIn.path);
  }

  const documentRequests = await db.documentRequest.findMany({
    where: {
      recipientEmail: session.user.email,
      status: {
        notIn: ["DRAFT", "COMPLETED", "CANCELLED"],
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    include: {
      project: {
        select: {
          code: true,
          name: true,
        },
      },
      requestedDocumentTypes: {
        include: {
          documentType: {
            select: {
              id: true,
              name: true,
              kind: true,
            },
          },
          documents: {
            orderBy: [{ createdAt: "desc" }],
            select: {
              id: true,
              documentRequestId: true,
              documentRequestDocumentTypeId: true,
              documentTypeId: true,
              fileName: true,
              fileUrl: true,
              validationStatus: true,
              validationNotes: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <Text variant="secondary" size="xs">
          Requests
        </Text>
        <Text variant="primary" size="3xl" as="h1">
          My Document Requests
        </Text>
        <p>Review and manage your pending document requests.</p>
      </header>

      {documentRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="w-full flex justify-between border-b border-zinc-200">
            <div>
              <Text variant="secondary" size="xs">
                {request.project.code}
              </Text>
              <Text variant="primary" size="2xl" as="h2">
                {request.project.name}
              </Text>
            </div>
            <div>
              <span className="inline-flex w-fit items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                {request.status}
              </span>
            </div>
          </CardHeader>

          <dl className="mt-4 grid gap-3 grid-cols-2">
            <div>
              <dt>
                <Text variant="secondary" size="xs">
                  Recipient
                </Text>
              </dt>
              <dd>
                <div>{request.recipientName}</div>
                <div>{request.recipientEmail}</div>
              </dd>
            </div>
            <div>
              <dt>
                <Text variant="secondary" size="xs">
                  Updated
                </Text>
              </dt>
              <dd>
                <div>{formatDate(request.updatedAt)}</div>
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Document</TableHeaderCell>
                    <TableHeaderCell>Kind</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {request.requestedDocumentTypes.map((item) => {
                    const existingDocument = item.documents.find(
                      (doc) => doc.validationStatus !== "INVALID",
                    );
                    const failedDocument = item.documents.find(
                      (doc) => doc.validationStatus === "INVALID",
                    );
                    const failedValidationNotes = toValidationNotes(
                      failedDocument?.validationNotes,
                    );
                    const canUpload = !existingDocument;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-zinc-900">
                          {item.documentType.name}
                        </TableCell>
                        <TableCell className="text-zinc-700">
                          {item.documentType.kind}
                        </TableCell>
                        <TableCell>
                          {existingDocument ? (
                            <div className="flex flex-col gap-1">
                              <a
                                href={existingDocument.fileUrl ?? undefined}
                                target="_blank"
                                rel="noreferrer"
                                className={
                                  existingDocument.fileUrl
                                    ? "text-blue-600 underline"
                                    : "text-zinc-900"
                                }
                              >
                                {existingDocument.fileName}
                              </a>
                              <span className="text-xs text-zinc-600">
                                Status: {existingDocument.validationStatus}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {failedDocument ? (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                                  <p className="font-medium">
                                    Last upload failed validation.
                                  </p>
                                  <p>File: {failedDocument.fileName}</p>
                                  {failedValidationNotes.length > 0 ? (
                                    <ul className="mt-1 list-disc space-y-1 pl-4">
                                      {failedValidationNotes.map((note, index) => (
                                        <li key={`${failedDocument.id}-note-${index}`}>{note}</li>
                                      ))}
                                    </ul>
                                  ) : null}
                                </div>
                              ) : null}

                              <form
                                action={uploadDocumentAction}
                                className="flex flex-col gap-2 sm:flex-row"
                              >
                                <input
                                  type="hidden"
                                  name="projectId"
                                  value={request.projectId}
                                />
                                <input
                                  type="hidden"
                                  name="documentRequestId"
                                  value={request.id}
                                />
                                <input
                                  type="hidden"
                                  name="documentRequestDocumentTypeId"
                                  value={item.id}
                                />
                                <input
                                  type="hidden"
                                  name="documentTypeId"
                                  value={item.documentTypeId}
                                />
                                <input
                                  type="file"
                                  name="file"
                                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                  required
                                  className="block w-full max-w-xs text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
                                />
                                <button
                                  type="submit"
                                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                                  disabled={!canUpload}
                                >
                                  Submit
                                </button>
                              </form>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
