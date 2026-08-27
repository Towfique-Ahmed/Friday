import Link from "next/link";

import { LinkButton } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";
import { TASK_TYPE_LABELS } from "@/lib/marketing";

const FEATURES = [
  {
    title: "Campaign command center",
    body: "Plan campaigns with goals, budgets, and timelines, then see every task rolling up underneath them.",
  },
  {
    title: "Content & social calendar",
    body: "A visual calendar of everything scheduled to publish — blog posts, social copy, emails, and ads — by channel and date.",
  },
  {
    title: "Marketing-shaped kanban board",
    body: "Backlog → To Do → In Progress → In Review → Approved → Scheduled → Published → Done. Built for creative and approval workflows, not generic tickets.",
  },
  {
    title: "Built-in approvals",
    body: "Move content through review and sign-off before it ever goes live, with a full comment trail on every task.",
  },
  {
    title: "Every channel, one place",
    body: "Instagram, Facebook, X, LinkedIn, TikTok, YouTube, blog, email, and website work all live side by side.",
  },
  {
    title: "Team workspace",
    body: "Invite your marketers, assign owners, and keep campaigns, content, and comms in a single shared home.",
  },
];

const WORK_TYPES = Object.values(TASK_TYPE_LABELS);

export default async function LandingPage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-bold">
            F
          </span>
          <span className="text-lg font-semibold">Friday</span>
        </div>
        <nav className="flex items-center gap-3">
          {user ? (
            <LinkButton href="/dashboard" size="sm">
              Go to dashboard
            </LinkButton>
          ) : (
            <>
              <Link href="/login" className="text-sm text-ink-300 hover:text-white">
                Sign in
              </Link>
              <LinkButton href="/register" size="sm">
                Start for free
              </LinkButton>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-12 text-center sm:pt-20">
        <span className="mb-5 inline-block rounded-full border border-ink-700 bg-ink-900 px-3 py-1 text-xs font-medium text-brand-300">
          Built for marketing teams
        </span>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Task management made for <span className="text-brand-400">marketers</span>, not generic
          project boards.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-300">
          Friday brings your content calendar, social posts, campaigns, and approvals into one
          workspace — so your marketing team ships more and chases fewer status updates.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <LinkButton href="/register" size="lg">
            Create your workspace
          </LinkButton>
          <LinkButton href="/login" size="lg" variant="secondary">
            Sign in
          </LinkButton>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
          {WORK_TYPES.map((label) => (
            <span
              key={label}
              className="rounded-full border border-ink-700 bg-ink-900 px-3 py-1 text-xs text-ink-300"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-ink-800 bg-ink-900 p-6"
            >
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-ink-400">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-800 py-8 text-center text-sm text-ink-500">
        Friday — task management for marketing teams.
      </footer>
    </div>
  );
}
