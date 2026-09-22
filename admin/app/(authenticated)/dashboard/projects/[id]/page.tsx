import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { db } from "@/lib/db/db";
import { Route } from "@/lib/routes";
import { DeleteProjectDialog } from "../components/DeleteProjectDialog";
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
          { label: "Dashboard", href: Route.Dashboard },
          { label: "Projects", href: Route.Projects },
          { label: project.name },
        ]}
      />

      <ProjectForm
        title="Project Details"
        description="Review and update this project’s delivery information."
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
        <DeleteProjectDialog projectId={project.id} action={deleteProjectAction} />
      </Card>
    </div>
  );
}
