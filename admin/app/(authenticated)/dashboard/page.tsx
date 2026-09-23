import Link from "next/link";

import { Breadcrumbs, Text } from "ox-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "ox-ui";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    activeDocumentTypes,
    inactiveDocumentTypes,
    latestDocumentTypeUpdate,
    activeProjects,
    inactiveProjects,
    latestProjectUpdate,
    totalDocumentRequests,
    sentDocumentRequests,
    latestDocumentRequestUpdate,
  ] = await Promise.all([
    db.documentType.count({ where: { isActive: true } }),
    db.documentType.count({ where: { isActive: false } }),
    db.documentType.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    db.project.count({ where: { isActive: true } }),
    db.project.count({ where: { isActive: false } }),
    db.project.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    db.documentRequest.count(),
    db.documentRequest.count({ where: { status: "SENT" } }),
    db.documentRequest.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);

  const totalDocumentTypes = activeDocumentTypes + inactiveDocumentTypes;
  const totalProjects = activeProjects + inactiveProjects;
  const lastDocumentTypeUpdatedLabel = latestDocumentTypeUpdate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(latestDocumentTypeUpdate.updatedAt)
    : "N/A";
  const lastProjectUpdatedLabel = latestProjectUpdate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(latestProjectUpdate.updatedAt)
    : "N/A";
  const lastDocumentRequestUpdatedLabel = latestDocumentRequestUpdate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(latestDocumentRequestUpdate.updatedAt)
    : "N/A";

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[ Route.Dashboard ]} />

      <header>
        <Text variant="secondary" size="xs">Overview</Text>
        <Text variant="primary" size="3xl" as="h1">Dashboard</Text>
        <p>
          Manage core admin configuration for document ingestion and validation.
        </p>
      </header>

      <Link href={Route.DocumentRequests.path} className="block">
        <Card className="cursor-pointer transition hover:border-zinc-300 hover:shadow-md">
          <CardHeader>
            <Text variant="secondary" size="xs">Requests</Text>
            <Text variant="primary" size="2xl">Document Requests</Text>
            <CardDescription>
              Create requests tied to a project, choose required document types, and email the portal invite.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Total</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{totalDocumentRequests}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Sent</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{sentDocumentRequests}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Last Updated</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{lastDocumentRequestUpdatedLabel}</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href={Route.DocumentTypes.path} className="block">
        <Card className="cursor-pointer transition hover:border-zinc-300 hover:shadow-md">
          <CardHeader>
            <Text variant="secondary" size="xs">Configuration</Text>
            <Text variant="primary" size="2xl">Document Types</Text>
            <CardDescription>
              Maintain document classification types used by extraction and validation rules.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Total</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{totalDocumentTypes}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Active</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{activeDocumentTypes}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Last Updated</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{lastDocumentTypeUpdatedLabel}</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href={Route.Projects.path} className="block">
        <Card className="cursor-pointer transition hover:border-zinc-300 hover:shadow-md">
          <CardHeader>
            <Text variant="secondary" size="xs">Portfolio</Text>
            <Text variant="primary" size="2xl">Projects</Text>
            <CardDescription>
              Track active delivery work, client assignments, and project lifecycle status.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Total</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{totalProjects}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Active</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{activeProjects}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">Last Updated</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{lastProjectUpdatedLabel}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
