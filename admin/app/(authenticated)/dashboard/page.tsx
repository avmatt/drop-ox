import Link from "next/link";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonClasses } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [activeDocumentTypes, inactiveDocumentTypes, latestUpdate] = await Promise.all([
    db.documentType.count({ where: { isActive: true } }),
    db.documentType.count({ where: { isActive: false } }),
    db.documentType.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);

  const totalDocumentTypes = activeDocumentTypes + inactiveDocumentTypes;
  const lastUpdatedLabel = latestUpdate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(latestUpdate.updatedAt)
    : "N/A";

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: Route.Dashboard }]} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="mt-2 text-zinc-600">
          Manage core admin configuration for document ingestion and validation.
        </p>
      </header>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Configuration
            </p>
            <CardTitle className="mt-2">Document Types</CardTitle>
            <CardDescription>
              Maintain document classification types used by extraction and validation rules.
            </CardDescription>
          </CardHeader>
          <Link
            href="/dashboard/document-types"
            className={buttonClasses({ size: "sm" })}
          >
            Open document types
          </Link>
        </div>

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
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{lastUpdatedLabel}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
