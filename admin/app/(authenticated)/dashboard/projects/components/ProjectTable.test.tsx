import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectTable } from "@/app/(authenticated)/dashboard/projects/components/ProjectTable";

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("ProjectTable", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("renders project rows and navigates to the detail page", () => {
    render(
      <ProjectTable
        projects={[
          {
            id: "project-1",
            code: "PRJ-100",
            name: "Hidden Market",
            client: "Northwind",
            status: "ACTIVE",
            startDate: new Date("2026-01-15T00:00:00.000Z"),
            updatedAt: new Date("2026-02-01T00:00:00.000Z"),
          },
        ]}
      />,
    );

    expect(screen.getByText("PRJ-100")).toBeInTheDocument();
    expect(screen.getByText("Hidden Market")).toBeInTheDocument();
    expect(screen.getByText("Northwind")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "View Hidden Market details" }));

    expect(pushMock).toHaveBeenCalledWith("/dashboard/projects/project-1");
  });
});
