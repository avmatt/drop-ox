import Link from "next/link";

import { db } from "@/lib/db/db";

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
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li className="font-semibold text-zinc-900" aria-current="page">
            Dashboard
          </li>
        </ol>
      </nav>

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="mt-2 text-zinc-600">
          Manage core admin configuration for document ingestion and validation.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Configuration
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              Document Types
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Maintain document classification types used by extraction and validation rules.
            </p>
          </div>
          <Link
            href="/dashboard/document-types"
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Open document types
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
        </div>
      </section>
    </div>
  );
}
