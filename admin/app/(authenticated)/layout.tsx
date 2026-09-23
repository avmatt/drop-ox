import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HomeIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";

import { Text } from "ox-ui";

import { auth } from "@/lib/auth/auth";
import { Route } from "@/lib/routes";
import { AuthDropdown } from "./components/AuthDropdown";

const navLinks = [
  {
    ...Route.Dashboard,
    icon: HomeIcon,
  },
  {
    ...Route.DocumentRequests,
    icon: ClipboardDocumentListIcon,
  },
  {
    ...Route.DocumentTypes,
    icon: DocumentTextIcon,
  },
  {
    ...Route.Projects,
    icon: RectangleGroupIcon,
  },
];

export default async function AuthenticatedLayout({
  children,
}: React.PropsWithChildren) {
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
                Admin Console
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

      <aside className="fixed top-20 h-full w-60 border-r border-zinc-200 bg-white p-4 shadow-sm">
        <nav className="space-y-1" aria-label="Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              <link.icon className="h-5 w-5 text-zinc-500" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen bg-zinc-100 text-zinc-900 min-w-0 p-6 pl-68 pt-26">
        {children}
      </main>
    </>
  );
}
