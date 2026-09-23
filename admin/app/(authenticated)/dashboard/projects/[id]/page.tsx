import { notFound } from "next/navigation";

import { Breadcrumbs, Card, ConfirmationDialog } from "ox-ui";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";
import { ProjectForm } from "../components/ProjectForm";
import { deleteProjectAction, updateProjectAction } from "../actions";

type ProjectDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
  });

  if (project === null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          Route.Dashboard,
          Route.Projects,
          { label: "Project Details" },
        ]}
      />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Portfolio
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Project Details
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Review and update this project&apos;s delivery information.
        </p>
      </header>

      <ProjectForm
        submitLabel="Save Changes"
        includeIsActive
        readOnlyUntilEdit
        action={updateProjectAction}
        values={{
          id: project.id,
          code: project.code,
          name: project.name,
          client: project.client,
          status: project.status,
          summary: project.summary,
          description: project.description,
          startDate: project.startDate.toISOString().slice(0, 10),
          endDate: project.endDate ? project.endDate.toISOString().slice(0, 10) : "",
          isActive: project.isActive,
        }}
      />

      <Card variant="danger">
        <p className="text-sm text-red-900">
          Deleting this project is permanent and cannot be undone.
        </p>
        <ConfirmationDialog
          triggerLabel="Delete Project"
          title="Confirm Deletion"
          description="Deleting this project is permanent and cannot be undone."
          confirmLabel="Confirm Delete"
          hiddenFields={[{ name: "id", value: project.id }]}
          action={deleteProjectAction}
          triggerClassName="mt-4 border-red-300 text-red-800 hover:bg-red-100"
        />
      </Card>
    </div>
  );
}
