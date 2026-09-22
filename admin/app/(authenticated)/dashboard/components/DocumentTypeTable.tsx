"use client";

import { useRouter } from "next/navigation";

type DocumentTypeTableProps = {
  documentTypes: readonly {
    id: string;
    kind: string;
    name: string;
    isActive: boolean;
    updatedAt: Date;
  }[];
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

export function DocumentTypeTable({
  documentTypes,
}: DocumentTypeTableProps) {
  const router = useRouter();

  const navigateToDetails = (id: string) => {
    router.push(`/dashboard/document-types/${id}`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-700">Type</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Kind</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Status</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {documentTypes.map((documentType) => (
              <tr
                key={documentType.id}
                className="cursor-pointer align-middle transition hover:bg-zinc-50 focus-within:bg-zinc-50"
                onClick={() => navigateToDetails(documentType.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToDetails(documentType.id);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View ${documentType.name} details`}
              >
                <td className="px-4 py-4 text-zinc-900">
                  <p className="font-semibold text-zinc-900">{documentType.name}</p>
                </td>
                <td className="px-4 py-4 text-zinc-600">{documentType.kind}</td>
                <td className="px-4 py-4 text-zinc-600">
                  {documentType.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-4 text-zinc-600">{formatDate(documentType.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}