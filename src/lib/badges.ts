import type { CampaignStatus, Priority, TaskStatus, TaskType } from "@/lib/marketing";

// Tailwind class pairs (background + text) for each domain value, so badges
// stay visually consistent across the board, calendar, and campaign views.

export const STATUS_STYLES: Record<TaskStatus, string> = {
  BACKLOG: "bg-ink-100 text-ink-600",
  TODO: "bg-sky-100 text-sky-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  IN_REVIEW: "bg-purple-100 text-purple-700",
  APPROVED: "bg-teal-100 text-teal-700",
  SCHEDULED: "bg-indigo-100 text-indigo-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  DONE: "bg-slate-200 text-slate-600",
};

export const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: "bg-ink-100 text-ink-500",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export const TYPE_STYLES: Record<TaskType, string> = {
  CONTENT: "bg-fuchsia-100 text-fuchsia-700",
  SOCIAL: "bg-pink-100 text-pink-700",
  EMAIL: "bg-cyan-100 text-cyan-700",
  SEO: "bg-lime-100 text-lime-700",
  PAID_ADS: "bg-yellow-100 text-yellow-700",
  DESIGN: "bg-violet-100 text-violet-700",
  EVENT: "bg-rose-100 text-rose-700",
  PR: "bg-teal-100 text-teal-700",
  ANALYTICS: "bg-blue-100 text-blue-700",
  OTHER: "bg-ink-100 text-ink-500",
};

export const CAMPAIGN_STATUS_STYLES: Record<CampaignStatus, string> = {
  PLANNING: "bg-ink-100 text-ink-600",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-slate-200 text-slate-500",
};
