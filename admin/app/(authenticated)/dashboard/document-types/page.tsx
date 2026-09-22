import Link from "next/link";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonClasses } from "@/components/ui/Button";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";
import { DocumentTypeTable } from "../components/DocumentTypeTable";

export default async function DocumentTypesPage() {
  const documentTypes = await db.documentType.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: Route.Dashboard }, { label: "Document Types" }]} />

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
          className={buttonClasses({ size: "sm" })}
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
