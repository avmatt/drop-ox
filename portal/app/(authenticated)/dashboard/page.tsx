import { headers } from "next/headers";
import {
  Breadcrumbs,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
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

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(Route.SignIn);
  }

  const documentRequests = await db.documentRequest.findMany({
    where: {
      recipientEmail: session.user.email,
      status: {
        notIn: ["COMPLETED", "CANCELLED"],
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
            select: {
              id: true,
              documentRequestId: true,
              documentRequestDocumentTypeId: true,
              documentTypeId: true,
              fileName: true,
              fileUrl: true,
              validationStatus: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: Route.Dashboard }]} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Portal Dashboard
        </h1>
        <p className="mt-2 text-zinc-600">
          This is the starting point for client-facing workflows.
        </p>
      </header>

      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Requests
          </p>
          <CardTitle className="mt-2">My Document Requests</CardTitle>
          <CardDescription>
            Review your document request progress.
          </CardDescription>
        </CardHeader>

        <div className="mt-6 space-y-4">
          {documentRequests.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              No document requests found for your account.
            </p>
          ) : (
            documentRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b border-zinc-200 pb-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      {request.project.code}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-zinc-900">
                      {request.project.name}
                    </h3>
                  </div>

                  <span className="inline-flex w-fit items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {request.status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Recipient
                    </dt>
                    <dd className="mt-1 text-zinc-900">
                      {request.recipientName || request.recipientEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Updated
                    </dt>
                    <dd className="mt-1 text-zinc-900">
                      {formatDate(request.updatedAt)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5">
                  <div className="overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                      <thead className="bg-zinc-50">
                        <tr>
                          <th className="px-3 py-2 font-semibold text-zinc-700">
                            Document
                          </th>
                          <th className="px-3 py-2 font-semibold text-zinc-700">
                            Kind
                          </th>
                          <th className="px-3 py-2 font-semibold text-zinc-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        {request.requestedDocumentTypes.map((item) => {
                          const existingDocument = item.documents.find(
                            (doc) => doc.validationStatus !== "INVALID",
                          );
                          const canUpload = !existingDocument;

                          return (
                            <tr key={item.id}>
                              <td className="px-3 py-2 text-zinc-900">
                                {item.documentType.name}
                              </td>
                              <td className="px-3 py-2 text-zinc-700">
                                {item.documentType.kind}
                              </td>
                              <td className="px-3 py-2">
                                {existingDocument ? (
                                  <div className="flex flex-col gap-1">
                                    <a
                                      href={
                                        existingDocument.fileUrl ?? undefined
                                      }
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
                                      Status:{" "}
                                      {existingDocument.validationStatus}
                                    </span>
                                  </div>
                                ) : (
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
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
