import Link from "next/link";

import { Breadcrumbs, Button } from "ox-ui";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";

import { DocumentRequestTable } from "./components/DocumentRequestTable";

export const dynamic = "force-dynamic";

export default async function DocumentRequestsPage() {
  const documentRequests = await db.documentRequest.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      project: true,
      requestedDocumentTypes: {
        include: {
          documentType: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[ Route.Dashboard, Route.DocumentRequests]} />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Requests</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Document Requests
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Create requests tied to a project, choose the document types you need, and send the invite by email.
          </p>
        </div>

        <Button as={Link} href={`${Route.DocumentRequests.path}/new`} size="sm">
          New request
        </Button>
      </header>

      <DocumentRequestTable
        documentRequests={documentRequests.map((documentRequest) => ({
          id: documentRequest.id,
          recipientEmail: documentRequest.recipientEmail,
          recipientName: documentRequest.recipientName,
          status: documentRequest.status,
          project: {
            code: documentRequest.project.code,
            name: documentRequest.project.name,
          },
          requestedDocumentTypes: documentRequest.requestedDocumentTypes.map((item) => ({
            documentType: {
              name: item.documentType.name,
            },
          })),
          updatedAt: documentRequest.updatedAt,
        }))}
      />
    </div>
  );
}
