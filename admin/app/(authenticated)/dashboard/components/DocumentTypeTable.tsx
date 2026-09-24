"use client";

import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@drop-ox/ox-ui";

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
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Kind</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Last Updated</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentTypes.map((documentType) => (
              <TableRow
                key={documentType.id}
                className="cursor-pointer transition hover:bg-zinc-50 focus-within:bg-zinc-50"
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
                <TableCell className="text-zinc-900">
                  <p className="font-semibold text-zinc-900">{documentType.name}</p>
                </TableCell>
                <TableCell>{documentType.kind}</TableCell>
                <TableCell>
                  {documentType.isActive ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>{formatDate(documentType.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}