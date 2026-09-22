import { headers } from "next/headers";
import { Breadcrumbs, Card, CardDescription, CardHeader, CardTitle } from "ox-ui";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";

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
    return null;
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
              name: true,
              kind: true,
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
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Portal Dashboard</h1>
        <p className="mt-2 text-zinc-600">
          This is the starting point for client-facing workflows.
        </p>
      </header>

      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Requests</p>
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
                    <dd className="mt-1 text-zinc-900">{formatDate(request.updatedAt)}</dd>
                  </div>
                </dl>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-zinc-800">Document types</p>
                  <div className="overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                      <thead className="bg-zinc-50">
                        <tr>
                          <th className="px-3 py-2 font-semibold text-zinc-700">Name</th>
                          <th className="px-3 py-2 font-semibold text-zinc-700">Kind</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        {request.requestedDocumentTypes.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="px-3 py-3 text-zinc-600">
                              No document types selected.
                            </td>
                          </tr>
                        ) : (
                          request.requestedDocumentTypes.map((item) => (
                            <tr key={item.id}>
                              <td className="px-3 py-2 text-zinc-900">{item.documentType.name}</td>
                              <td className="px-3 py-2 text-zinc-700">{item.documentType.kind}</td>
                            </tr>
                          ))
                        )}
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
