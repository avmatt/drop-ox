"use client";

import { useRouter } from "next/navigation";

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
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-700">Recipient</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Project</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Documents</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Status</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {documentRequests.map((documentRequest) => (
              <tr
                key={documentRequest.id}
                className="cursor-pointer align-middle transition hover:bg-zinc-50 focus-within:bg-zinc-50"
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
                <td className="px-4 py-4 text-zinc-900">
                  <p className="font-semibold text-zinc-900">
                    {documentRequest.recipientName ?? documentRequest.recipientEmail}
                  </p>
                  <p className="text-xs text-zinc-500">{documentRequest.recipientEmail}</p>
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  <p className="font-medium text-zinc-900">{documentRequest.project.name}</p>
                  <p className="text-xs text-zinc-500">{documentRequest.project.code}</p>
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {documentRequest.requestedDocumentTypes.length}
                </td>
                <td className="px-4 py-4 text-zinc-600">
                  {DOCUMENT_REQUEST_STATUS_LABELS[documentRequest.status]}
                </td>
                <td className="px-4 py-4 text-zinc-600">{formatDate(documentRequest.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
