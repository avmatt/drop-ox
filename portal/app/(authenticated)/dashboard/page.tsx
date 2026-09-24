import { headers } from "next/headers";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@drop-ox/ox-ui";

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
    return value.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    );
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  return [];
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function toAcceptedExtensions(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0)
    .map((item) => (item.startsWith(".") ? item : `.${item}`));
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
              requiredFields: true,
              acceptedFileTypes: true,
              acceptedFileExtensions: true,
              maxFileSizeMb: true,
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
              extractedData: true,
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
            <div className="pb-4">
              <Text variant="secondary" size="xs">
                {request.project.code}
              </Text>
              <Text variant="primary" size="2xl" as="h2">
                {request.project.name}
              </Text>
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
                    <TableHeaderCell>Requirements</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {request.requestedDocumentTypes.map((item) => {
                    const existingDocument = item.documents.find(
                      (doc) => doc.validationStatus !== "INVALID",
                    );
                    const existingValidationNotes = toValidationNotes(
                      existingDocument?.validationNotes,
                    );
                    const existingExtractedContent =
                      typeof existingDocument?.extractedData === "string"
                        ? existingDocument.extractedData.trim()
                        : "";
                    const failedDocument = item.documents.find(
                      (doc) => doc.validationStatus === "INVALID",
                    );
                    const failedValidationNotes = toValidationNotes(
                      failedDocument?.validationNotes,
                    );
                    const failedExtractedContent =
                      typeof failedDocument?.extractedData === "string"
                        ? failedDocument.extractedData.trim()
                        : "";
                    const acceptedExtensions = toAcceptedExtensions(
                      item.documentType.acceptedFileExtensions,
                    );
                    const acceptedFileTypes = toStringArray(
                      item.documentType.acceptedFileTypes,
                    );
                    const requiredFields = toStringArray(
                      item.documentType.requiredFields,
                    );
                    const acceptValue = acceptedExtensions.join(",");
                    const canUpload = !existingDocument;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-zinc-900 align-top">
                          {item.documentType.name}
                          <Text variant="secondary" size="xs">
                            {item.documentType.kind}
                          </Text>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 sm:mr-auto sm:max-w-xl">
                            <p className="font-semibold text-zinc-900">
                              Upload requirements
                            </p>
                            <ul className="mt-1 list-disc space-y-1 pl-4">
                              <li>
                                Maximum file size:{" "}
                                {item.documentType.maxFileSizeMb}MB
                              </li>
                              {acceptedExtensions.length > 0 ? (
                                <li>
                                  Allowed extensions:{" "}
                                  {acceptedExtensions.join(", ")}
                                </li>
                              ) : null}
                              {requiredFields.length > 0 ? (
                                <li>
                                  Required fields: {requiredFields.join(", ")}
                                </li>
                              ) : null}
                            </ul>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {existingDocument ? (
                            <div className="flex flex-col gap-2">
                              <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-2 text-xs text-zinc-700">
                                <p className="text-sm font-bold text-zinc-900">
                                  Uploaded file
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 justify-between">
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

                                  {existingDocument.fileUrl ? (
                                    <Button
                                      as="a"
                                      href={existingDocument.fileUrl}
                                      download={existingDocument.fileName}
                                      variant="primary"
                                      size="sm"
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs"
                                    >
                                      <ArrowDownTrayIcon className="h-4 w-4" />
                                    </Button>
                                  ) : null}
                                </div>
                              </div>

                              {existingDocument.validationStatus === "VALID" &&
                              existingValidationNotes.length > 0 ? (
                                <>
                                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
                                    <p className="text-sm font-bold">
                                      Validation passed
                                    </p>
                                    <ul className="mt-1 list-disc space-y-1 pl-4">
                                      {existingValidationNotes.map(
                                        (note, index) => (
                                          <li
                                            key={`${existingDocument.id}-note-${index}`}
                                          >
                                            {note}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>

                                  {/* <details className="rounded-md border border-zinc-200 bg-zinc-50 p-2">
                                    <summary className="cursor-pointer text-xs font-medium text-zinc-700">
                                      View extracted content
                                    </summary>
                                    <div className="mt-2 max-h-64 overflow-auto rounded bg-white p-2">
                                      <pre className="whitespace-pre-wrap break-words text-xs text-zinc-700">
                                        {existingExtractedContent.length > 0
                                          ? existingExtractedContent
                                          : "No extracted content available."}
                                      </pre>
                                    </div>
                                  </details> */}
                                </>
                              ) : null}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {failedDocument ? (
                                <>
                                  <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                                    <p className="text-sm font-bold">
                                      Validation failed
                                    </p>

                                    {failedValidationNotes.length > 0 ? (
                                      <ul className="mt-1 list-disc space-y-1 pl-4">
                                        {failedValidationNotes.map(
                                          (note, index) => (
                                            <li
                                              key={`${failedDocument.id}-note-${index}`}
                                            >
                                              {note}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    ) : null}
                                  </div>

                                  {/* <details className="rounded-md border border-zinc-200 bg-zinc-50 p-2">
                                    <summary className="cursor-pointer text-xs font-medium text-zinc-700">
                                      View extracted content
                                    </summary>
                                    <div className="mt-2 max-h-64 overflow-auto rounded bg-white p-2">
                                      <pre className="whitespace-pre-wrap break-words text-xs text-zinc-700">
                                        {failedExtractedContent.length > 0
                                          ? failedExtractedContent
                                          : "No extracted content available."}
                                      </pre>
                                    </div>
                                  </details> */}
                                </>
                              ) : null}

                              <form
                                action={uploadDocumentAction}
                                className="flex flex-col gap-2 sm:flex-row justify-between"
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
                                  accept={
                                    acceptValue.length > 0
                                      ? acceptValue
                                      : undefined
                                  }
                                  required
                                  className="block w-full max-w-xs text-sm text-zinc-600 file:mr-3 file:rounded-full file:font-semibold file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white file:cursor-pointer"
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={!canUpload}
                                >
                                  Submit
                                </Button>
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
