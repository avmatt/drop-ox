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

import { PROJECT_STATUS_LABELS, type ProjectStatus } from "../constants";

type ProjectTableProps = {
  projects: readonly {
    id: string;
    code: string;
    name: string;
    client: string;
    status: ProjectStatus;
    startDate: Date;
    updatedAt: Date;
  }[];
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
    year: "numeric",
  }).format(value);
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const router = useRouter();

  const navigateToDetails = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Code</TableHeaderCell>
              <TableHeaderCell>Project</TableHeaderCell>
              <TableHeaderCell>Client</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Start Date</TableHeaderCell>
              <TableHeaderCell>Last Updated</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="cursor-pointer transition hover:bg-zinc-50 focus-within:bg-zinc-50"
                onClick={() => navigateToDetails(project.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigateToDetails(project.id);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View ${project.name} details`}
              >
                <TableCell className="font-medium text-zinc-900">{project.code}</TableCell>
                <TableCell className="text-zinc-900">
                  <p className="font-semibold text-zinc-900">{project.name}</p>
                </TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>{PROJECT_STATUS_LABELS[project.status]}</TableCell>
                <TableCell>{formatDate(project.startDate)}</TableCell>
                <TableCell>{formatDate(project.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
