export const DOCUMENT_REQUEST_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export type DocumentRequestStatus = (typeof DOCUMENT_REQUEST_STATUS_OPTIONS)[number]["value"];

export const DOCUMENT_REQUEST_STATUS_VALUES = DOCUMENT_REQUEST_STATUS_OPTIONS.map(
  (option) => option.value,
) as readonly DocumentRequestStatus[];

export const DOCUMENT_REQUEST_STATUS_LABELS: Record<DocumentRequestStatus, string> =
  DOCUMENT_REQUEST_STATUS_OPTIONS.reduce(
    (labels, option) => ({
      ...labels,
      [option.value]: option.label,
    }),
    {} as Record<DocumentRequestStatus, string>,
  );
