import Link from "next/link";

import { Breadcrumbs, Button } from "ox-ui";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";
import { ProjectTable } from "./components/ProjectTable";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      client: true,
      status: true,
      startDate: true,
      updatedAt: true,
    },
    orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[Route.Dashboard, Route.Projects]} />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Portfolio
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Projects
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Review delivery work, project status, and client assignments across
            the portfolio.
          </p>
        </div>

        <Button as={Link} href={`${Route.Projects.path}/new`} size="sm">
          New project
        </Button>
      </header>

      <ProjectTable
        projects={projects.map((project) => ({
          id: project.id,
          code: project.code,
          name: project.name,
          client: project.client,
          status: project.status,
          startDate: project.startDate,
          updatedAt: project.updatedAt,
        }))}
      />
    </div>
  );
}
