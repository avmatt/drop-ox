"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CircleStackIcon,
  CloudArrowUpIcon,
  CubeTransparentIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import { motion, useReducedMotion } from "framer-motion";
import type { ComponentType, ReactNode, SVGProps } from "react";

const adminStories = [
  "Restrict access to Solar Landscape users only.",
  "Configure document type definitions and validation rules quickly.",
  "Configure projects alongside document types in one place.",
  "Send and review document requests with pre-validation for accuracy.",
  "Cut cycle time when requesting and receiving documents.",
];

const partnerStories = [
  "View open document requests in one dashboard.",
  "Understand document requirements before upload.",
  "Know when a document is validated and complete.",
  "Cut cycle time when sending requested documents.",
];

const stack = [
  "NextJS",
  "TypeScript",
  "TailwindCSS",
  "ESLint",
  "Prettier",
  "Vitest",
];
const services = [
  "Microsoft Entra ID",
  "Azure Database for PostgreSQL flexible server",
  "Azure Blob Storage",
  "Microsoft Foundry with Azure OpenAI",
  "GMail",
];
const libraries = [
  "Better Auth",
  "NodeMailer",
  "HeadlessUI",
  "HeroIcons",
  "Prisma",
  "Mammoth (DOCX)",
  "PDF-parse",
  "Tesseract (OCR)",
];

const builtWithLogos = [
  {
    label: "Microsoft Entra ID",
    Icon: ShieldCheckIcon,
  },
  {
    label: "Azure PostgreSQL",
    Icon: CircleStackIcon,
  },
  {
    label: "Azure Blob Storage",
    Icon: CloudArrowUpIcon,
  },
  {
    label: "Azure OpenAI",
    Icon: SparklesIcon,
  },
  {
    label: "Prisma",
    Icon: CubeTransparentIcon,
  },
  {
    label: "NextJS",
    Icon: RocketLaunchIcon,
  },
] as const satisfies ReadonlyArray<{
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}>;

const proofQuotes = [
  {
    quote:
      "DropOX gave us cleaner first submissions and fewer clarification loops before review.",
    role: "Operations Team",
  },
  {
    quote:
      "Partners know exactly what to upload, and we can track completion status with confidence.",
    role: "Project Admin",
  },
];

const revealContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

type MarketingDeckProps = {
  signInPath: string;
};

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-300/60 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white">
      {children}
    </div>
  );
}

export function MarketingDeck({ signInPath }: MarketingDeckProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#f7f6f1] text-slate-900">
      <motion.div
        className="pointer-events-none absolute -top-20 left-[-8rem] h-[24rem] w-[24rem] rounded-full bg-cyan-400/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 30, -20, 0],
                y: [0, -18, 12, 0],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 18,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
        }
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-7rem] right-[-5rem] h-[22rem] w-[22rem] rounded-full bg-orange-300/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -22, 15, 0],
                y: [0, 20, -10, 0],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 22,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }
        }
      />

      <header className="sticky top-0 z-30 border-b border-slate-300/60 bg-[#f7f6f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div>
              <Image
                src="/logo-ox-black.png"
                alt="DropOX logo"
                width={70}
                height={40}
                className="h-10"
                priority
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
                Drop OX
              </p>
              <p className="text-lg text-slate-500 font-semibold">
                Intelligent document requests
              </p>
            </div>
          </div>
          
          <Link
            href={signInPath}
            className="rounded-full bg-solar-orange text-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 transition"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-10 lg:pb-24 lg:pt-24">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <p className="mb-5 inline-flex rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
              Introduction
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              DropOX helps teams request, submit, and validate documents with
              confidence.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
              It is a document request system with intelligent validation, built
              to reduce ambiguity, shorten cycle time, and improve first-pass
              document quality.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={signInPath}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-zinc-200"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-cyan-600 hover:text-cyan-700"
              >
                See Demo Flow
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={revealContainer}
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.35 }}
            className="mt-12 grid gap-4 md:grid-cols-3"
          >
            {[
              "Fewer clarification loops between admin and partners",
              "Faster first-pass validation before manual review",
              "Clearer handoff from document request to completion",
            ].map((item) => (
              <motion.div key={item} variants={revealItem}>
                <Card>
                  <p className="text-sm text-slate-700">{item}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={revealContainer}
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            className="mt-8 rounded-3xl border border-slate-300/60 bg-white/70 p-5"
          >
            <motion.p
              variants={revealItem}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Built With
            </motion.p>
            <motion.div
              variants={revealItem}
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
            >
              {builtWithLogos.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-[96px] flex-col items-start justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-3 text-left shadow-sm"
                >
                  <item.Icon className="h-8 w-8 text-cyan-700" aria-hidden="true" />
                  <span className="text-md font-medium leading-tight text-slate-700">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section id="why" className="border-y border-slate-300/60 bg-white/70">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
            <motion.div
              variants={revealContainer}
              initial={reduceMotion ? undefined : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.p
                variants={revealItem}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600"
              >
                Ideate
              </motion.p>
              <motion.h2
                variants={revealItem}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Built around real user stories
              </motion.h2>
              <motion.p
                variants={revealItem}
                className="mt-4 max-w-3xl text-slate-700"
              >
                DropOX serves two audiences with one shared objective: reduce
                cycle time while improving document quality.
              </motion.p>

              <div className="mt-9 grid gap-5 lg:grid-cols-2">
                <motion.article variants={revealItem}>
                  <Card>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Admin Console
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                      {adminStories.map((story) => (
                        <li key={story} className="flex gap-2">
                          <span className="mt-[9px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                          <span>{story}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.article>

                <motion.article variants={revealItem}>
                  <Card>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Partner Portal
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                      {partnerStories.map((story) => (
                        <li key={story} className="flex gap-2">
                          <span className="mt-[9px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                          <span>{story}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.article>
              </div>

              <motion.div
                variants={revealItem}
                className="mt-8 grid gap-4 md:grid-cols-2"
              >
                {proofQuotes.map((item) => (
                  <Card key={item.quote}>
                    <p className="text-sm leading-relaxed text-slate-700">
                      "{item.quote}"
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {item.role}
                    </p>
                  </Card>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-24"
        >
          <motion.div
            variants={revealContainer}
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p
              variants={revealItem}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600"
            >
              Create
            </motion.p>
            <motion.h2
              variants={revealItem}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              How it works from request to validated delivery
            </motion.h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Configure",
                  body: "Define document types, requirements, and projects in the admin console.",
                },
                {
                  number: "02",
                  title: "Request",
                  body: "Send clear document requests with criteria visible to submitters.",
                },
                {
                  number: "03",
                  title: "Validate",
                  body: "Evaluate uploads with deterministic checks and AI-assisted validation.",
                },
              ].map((item) => (
                <motion.article key={item.title} variants={revealItem}>
                  <Card>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                      {item.number}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      {item.body}
                    </p>
                  </Card>
                </motion.article>
              ))}
            </div>

            <motion.div
              variants={revealItem}
              className="mt-8 grid gap-5 lg:grid-cols-2"
            >
              <Card>
                <h3 className="text-lg font-semibold text-slate-900">
                  Admin Console Snapshot
                </h3>
                <div className="mt-4 rounded-2xl border border-slate-300 bg-[linear-gradient(130deg,#f8fafc,#e2e8f0)] p-4">
                  <div className="mb-3 h-2 w-24 rounded-full bg-cyan-300/50" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 rounded-xl bg-slate-300/60" />
                    <div className="h-16 rounded-xl bg-slate-300/60" />
                    <div className="h-16 rounded-xl bg-slate-300/60" />
                  </div>
                  <div className="mt-3 h-20 rounded-xl bg-slate-300/60" />
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-slate-900">
                  Partner Portal Snapshot
                </h3>
                <div className="mt-4 rounded-2xl border border-slate-300 bg-[linear-gradient(130deg,#fff7ed,#ffedd5)] p-4">
                  <div className="mb-3 flex gap-2">
                    <div className="h-8 w-24 rounded-lg bg-slate-300/70" />
                    <div className="h-8 w-24 rounded-lg bg-slate-300/70" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-10 rounded-xl bg-emerald-300/20" />
                    <div className="h-10 rounded-xl bg-rose-300/20" />
                    <div className="h-10 rounded-xl bg-slate-300/60" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={revealItem}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href={signInPath}
                className="rounded-full bg-solar-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                Start With DropOX
              </Link>
              <Link
                href="#platform"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-cyan-600 hover:text-cyan-700"
              >
                View Platform Details
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section
          id="platform"
          className="border-y border-slate-300/60 bg-stone-100/75"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
            <motion.div
              variants={revealContainer}
              initial={reduceMotion ? undefined : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.p
                variants={revealItem}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600"
              >
                Technical Design
              </motion.p>
              <motion.h2
                variants={revealItem}
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Production-ready platform choices
              </motion.h2>

              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {[
                  { heading: "Tech Stack", items: stack },
                  { heading: "Services", items: services },
                  { heading: "Libraries", items: libraries },
                ].map((group) => (
                  <motion.article key={group.heading} variants={revealItem}>
                    <Card>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {group.heading}
                      </h3>
                      <ul className="mt-4 space-y-2 text-sm text-slate-700">
                        {group.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-[8px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.article>
                ))}
              </div>

              <motion.article variants={revealItem} className="mt-8">
                <Card>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Monorepo Structure
                  </h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {[
                      { name: "@drop-ox/admin", desc: "Admin console" },
                      { name: "@drop-ox/portal", desc: "Partner portal" },
                      { name: "@drop-ox/ox-ui", desc: "Shared UI library" },
                    ].map((pkg) => (
                      <div
                        key={pkg.name}
                        className="rounded-2xl border border-white/15 bg-slate-50 p-4"
                      >
                        <p className="text-sm font-semibold text-cyan-600">
                          {pkg.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {pkg.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.article>

              <motion.div
                variants={revealItem}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href={signInPath}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-zinc-200"
                >
                  Request Access
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          id="roadmap"
          className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-24"
        >
          <motion.div
            variants={revealContainer}
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p
              variants={revealItem}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600"
            >
              Refine
            </motion.p>
            <motion.h2
              variants={revealItem}
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Continuous quality and improvement plan
            </motion.h2>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <motion.article variants={revealItem}>
                <Card>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Testing approach
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2">
                      <span className="mt-[8px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                      <span>Manual testing for real workflow validation</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[8px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                      <span>
                        Unit tests written by Copilot and reviewed by me
                      </span>
                    </li>
                  </ul>
                </Card>
              </motion.article>

              <motion.article variants={revealItem}>
                <Card>
                  <h3 className="text-lg font-semibold text-slate-900">
                    What comes next
                  </h3>
                  <ul className="mt-4 grid gap-2 text-sm text-slate-700">
                    {[
                      "UI improvements",
                      "ox-lib for shared utils",
                      "Ephemeral environments for PRs",
                      "Analytics and telemetry",
                      "Component tests",
                      "E-signature integration",
                    ].map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.article>
            </div>

            <motion.div
              variants={revealItem}
              className="mt-10 rounded-3xl border border-cyan-200/35 bg-cyan-200/10 p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-solar-blue">
                Ready to use DropOX?
              </p>
              <p className="mt-2 max-w-2xl text-slate-700">
                Sign in with Microsoft Entra ID and start managing document
                requests with faster validation cycles.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={signInPath}
                  className="inline-flex rounded-full bg-solar-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
                >
                  Sign In to Portal
                </Link>
                <Link
                  href="#why"
                  className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-cyan-600 hover:text-cyan-700"
                >
                  Review Benefits
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
