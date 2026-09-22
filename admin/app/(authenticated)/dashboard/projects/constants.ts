export const PROJECT_STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning" },
  { value: "ACTIVE", label: "Active" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number]["value"];

export const PROJECT_STATUS_VALUES = PROJECT_STATUS_OPTIONS.map(
  (option) => option.value,
) as readonly ProjectStatus[];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> =
  PROJECT_STATUS_OPTIONS.reduce(
    (labels, option) => ({
      ...labels,
      [option.value]: option.label,
    }),
    {} as Record<ProjectStatus, string>,
  );