import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Text } from "@drop-ox/ox-ui";

import { auth } from "@/lib/auth/auth";
import { Route } from "@/lib/routes";
import { AuthDropdown } from "./components/AuthDropdown";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(Route.SignIn.path);
  }

  const name = session.user.name || session.user.email;

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div>
          <Link href={Route.Dashboard.path} className="flex gap-2">
            <div>
              <Image
                src="/logo-ox-black.png"
                width={70}
                height={40}
                alt="Drop OX Logo"
              />
            </div>
            <div>
              <Text variant="secondary" size="xs">
                Drop OX
              </Text>
              <Text variant="primary" size="lg">
                Partner Portal
              </Text>
            </div>
          </Link>
        </div>
        <div className="z-10">
          <AuthDropdown email={session.user.email} name={name} />
        </div>
        <div className="absolute right-0 top-0 h-full flex -mr-5">
          <div className="bg-solar-orange h-30 w-10 -mt-5 rotate-30" />
          <div className="bg-solar-yellow h-30 w-10 -mt-5 rotate-30" />
          <div className="bg-solar-blue h-30 w-10 -mt-5 rotate-30" />
        </div>
      </header>

      <main className="min-h-screen bg-zinc-100 text-zinc-900 min-w-0 p-6 pt-26">
        {children}
      </main>
    </>
  );
}
