import Link from "next/link";

import { db } from "@/lib/db/db";
import { DocumentTypeTable } from "../components/DocumentTypeTable";

export default async function DocumentTypesPage() {
  const documentTypes = await db.documentType.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard" className="font-medium text-zinc-700 transition hover:text-zinc-900">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">
            /
          </li>
          <li className="font-semibold text-zinc-900" aria-current="page">
            Document Types
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Configuration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Document Types
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Select a row to open details and manage a specific document type.
          </p>
        </div>

        <Link
          href="/dashboard/document-types/new"
          className="h-fit rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          New document type
        </Link>
      </header>

      <DocumentTypeTable
        documentTypes={documentTypes.map((documentType) => ({
          id: documentType.id,
          kind: documentType.kind,
          name: documentType.name,
          isActive: documentType.isActive,
          updatedAt: documentType.updatedAt,
        }))}
      />
    </div>
  );
}
