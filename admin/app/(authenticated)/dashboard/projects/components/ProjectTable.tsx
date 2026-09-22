"use client";

import { useRouter } from "next/navigation";

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
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-700">Code</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Project</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Client</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Status</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Start Date</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="cursor-pointer align-middle transition hover:bg-zinc-50 focus-within:bg-zinc-50"
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
                <td className="px-4 py-4 font-medium text-zinc-900">{project.code}</td>
                <td className="px-4 py-4 text-zinc-900">
                  <p className="font-semibold text-zinc-900">{project.name}</p>
                </td>
                <td className="px-4 py-4 text-zinc-600">{project.client}</td>
                <td className="px-4 py-4 text-zinc-600">{PROJECT_STATUS_LABELS[project.status]}</td>
                <td className="px-4 py-4 text-zinc-600">{formatDate(project.startDate)}</td>
                <td className="px-4 py-4 text-zinc-600">{formatDate(project.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
