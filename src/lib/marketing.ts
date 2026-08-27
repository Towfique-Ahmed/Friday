// Domain vocabulary for Friday — the marketing-team task manager.
// Kept as plain string unions (backed by String columns in Prisma, since the
// default SQLite provider doesn't support native enums) so the same values
// work identically if the datasource is later swapped to PostgreSQL.

export const TASK_TYPES = [
  "CONTENT",
  "SOCIAL",
  "EMAIL",
  "SEO",
  "PAID_ADS",
  "DESIGN",
  "EVENT",
  "PR",
  "ANALYTICS",
  "OTHER",
] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  CONTENT: "Content",
  SOCIAL: "Social Media",
  EMAIL: "Email Campaign",
  SEO: "SEO",
  PAID_ADS: "Paid Ads",
  DESIGN: "Design / Creative",
  EVENT: "Event",
  PR: "PR & Comms",
  ANALYTICS: "Analytics & Reporting",
  OTHER: "Other",
};

export const CHANNELS = [
  "INSTAGRAM",
  "FACEBOOK",
  "X",
  "LINKEDIN",
  "TIKTOK",
  "YOUTUBE",
  "BLOG",
  "EMAIL",
  "WEBSITE",
  "OTHER",
] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABELS: Record<Channel, string> = {
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  X: "X / Twitter",
  LINKEDIN: "LinkedIn",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  BLOG: "Blog",
  EMAIL: "Email",
  WEBSITE: "Website",
  OTHER: "Other",
};

export const TASK_STATUSES = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "DONE",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  DONE: "Done",
};

// Columns shown on the kanban board, in order.
export const BOARD_COLUMNS: TaskStatus[] = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "DONE",
];

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const CAMPAIGN_STATUSES = [
  "PLANNING",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export const MEMBERSHIP_ROLES = ["OWNER", "ADMIN", "MEMBER"] as const;
export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];
