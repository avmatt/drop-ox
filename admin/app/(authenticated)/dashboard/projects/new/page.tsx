import { Breadcrumbs } from "@drop-ox/ox-ui";
import { Route } from "@/lib/routes";
import { createProjectAction } from "../actions";
import { ProjectForm } from "../components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          Route.Dashboard,
          Route.Projects,
          { label: "New" },
        ]}
      />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Portfolio
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          New Project
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Add a new project definition for delivery planning and tracking.
        </p>
      </header>

      <ProjectForm
        submitLabel="Create Project"
        action={createProjectAction}
      />
    </div>
  );
}
