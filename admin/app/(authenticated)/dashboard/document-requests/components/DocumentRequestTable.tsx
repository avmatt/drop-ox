"use client";

import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "ox-ui";

import { DOCUMENT_REQUEST_STATUS_LABELS, type DocumentRequestStatus } from "../constants";

type DocumentRequestTableProps = {
  documentRequests: readonly {
    id: string;
    recipientEmail: string;
    recipientName: string | null;
    status: DocumentRequestStatus;
    project: {
      code: string;
      name: string;
    };
    requestedDocumentTypes: readonly {
      documentType: {
        name: string;
      };
    }[];
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

export function DocumentRequestTable({ documentRequests }: DocumentRequestTableProps) {
  const router = useRouter();

  const navigateToDetails = (id: string) => {
    router.push(`/dashboard/document-requests/${id}`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Recipient</TableHeaderCell>
              <TableHeaderCell>Project</TableHeaderCell>
              <TableHeaderCell>Documents</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Last Updated</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentRequests.map((documentRequest) => (
              <TableRow
                key={documentRequest.id}
                className="cursor-pointer transition hover:bg-zinc-50 focus-within:bg-zinc-50"
                onClick={() => navigateToDetails(documentRequest.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToDetails(documentRequest.id);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View request for ${documentRequest.recipientEmail} details`}
              >
                <TableCell className="text-zinc-900">
                  <p className="font-semibold text-zinc-900">
                    {documentRequest.recipientName ?? documentRequest.recipientEmail}
                  </p>
                  <p className="text-xs text-zinc-500">{documentRequest.recipientEmail}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-zinc-900">{documentRequest.project.name}</p>
                  <p className="text-xs text-zinc-500">{documentRequest.project.code}</p>
                </TableCell>
                <TableCell>
                  {documentRequest.requestedDocumentTypes.length}
                </TableCell>
                <TableCell>
                  {DOCUMENT_REQUEST_STATUS_LABELS[documentRequest.status]}
                </TableCell>
                <TableCell>{formatDate(documentRequest.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
