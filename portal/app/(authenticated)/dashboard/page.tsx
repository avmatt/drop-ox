import { Breadcrumbs, Card, CardDescription, CardHeader, CardTitle } from "ox-ui";

import { Route } from "@/lib/routes";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: Route.Dashboard }]} />

      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Portal Dashboard</h1>
        <p className="mt-2 text-zinc-600">
          This is the starting point for client-facing workflows.
        </p>
      </header>

      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Status</p>
          <CardTitle className="mt-2">Scaffold Complete</CardTitle>
          <CardDescription>
            Authentication, protected layout, and database client setup are in place.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
