import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { Route } from "@/lib/routes";
import { MarketingDeck } from "@/app/components/MarketingDeck";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(Route.Dashboard.path);
  }

  return <MarketingDeck signInPath={Route.SignIn.path} />;
}
