import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DocumentRequestTable } from "@/app/(authenticated)/dashboard/document-requests/components/DocumentRequestTable";

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("DocumentRequestTable", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("renders request rows and navigates to the detail page", () => {
    render(
      <DocumentRequestTable
        documentRequests={[
          {
            id: "request-1",
            recipientEmail: "person@example.com",
            recipientName: "Pat Person",
            status: "SENT",
            project: {
              code: "PRJ-100",
              name: "Hidden Market",
            },
            requestedDocumentTypes: [
              { documentType: { name: "Insurance Certificate" } },
            ],
            updatedAt: new Date("2026-02-01T00:00:00.000Z"),
          },
        ]}
      />,
    );

    expect(screen.getByText("Pat Person")).toBeInTheDocument();
    expect(screen.getByText("Hidden Market")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "View request for person@example.com details" }));

    expect(pushMock).toHaveBeenCalledWith("/dashboard/document-requests/request-1");
  });
});
