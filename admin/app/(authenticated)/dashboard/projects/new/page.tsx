import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Route } from "@/lib/routes";
import { createProjectAction } from "../actions";
import { ProjectForm } from "../components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: Route.Dashboard },
          { label: "Projects", href: Route.Projects },
          { label: "New" },
        ]}
      />

      <ProjectForm
        title="Create Project"
        description="Add a new project definition for delivery planning and tracking."
        submitLabel="Create Project"
        action={createProjectAction}
      />
    </div>
  );
}
