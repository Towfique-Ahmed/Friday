"use server";

import crypto from "node:crypto";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession, destroySession, hashPassword, requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CAMPAIGN_STATUSES, CHANNELS, PRIORITIES, TASK_STATUSES, TASK_TYPES } from "@/lib/marketing";

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

function optionalString(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str.length > 0 ? str : null;
}

function toDate(value: FormDataEntryValue | null): Date | null {
  const str = optionalString(value);
  if (!str) return null;
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
}

const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(5000).optional().default(""),
  type: z.enum(TASK_TYPES),
  channel: z.enum(CHANNELS).optional().nullable(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(PRIORITIES),
  campaignId: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
});

function parseTaskForm(formData: FormData) {
  return taskSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    type: formData.get("type"),
    channel: optionalString(formData.get("channel")),
    status: formData.get("status"),
    priority: formData.get("priority"),
    campaignId: optionalString(formData.get("campaignId")),
    assigneeId: optionalString(formData.get("assigneeId")),
    dueDate: optionalString(formData.get("dueDate")),
    scheduledAt: optionalString(formData.get("scheduledAt")),
  });
}

export async function createTaskAction(formData: FormData) {
  const user = await requireSessionUser();
  const data = parseTaskForm(formData);

  const maxPosition = await prisma.task.aggregate({
    where: { organizationId: user.organizationId, status: data.status },
    _max: { position: true },
  });

  const task = await prisma.task.create({
    data: {
      organizationId: user.organizationId,
      createdById: user.id,
      title: data.title,
      description: data.description ?? "",
      type: data.type,
      channel: data.channel ?? null,
      status: data.status,
      priority: data.priority,
      campaignId: data.campaignId || null,
      assigneeId: data.assigneeId || null,
      dueDate: toDate(formData.get("dueDate")),
      scheduledAt: toDate(formData.get("scheduledAt")),
      position: (maxPosition._max.position ?? 0) + 1,
    },
  });

  redirect(`/tasks/${task.id}`);
}

export async function updateTaskAction(taskId: string, formData: FormData) {
  const user = await requireSessionUser();
  const data = parseTaskForm(formData);

  await prisma.task.updateMany({
    where: { id: taskId, organizationId: user.organizationId },
    data: {
      title: data.title,
      description: data.description ?? "",
      type: data.type,
      channel: data.channel ?? null,
      status: data.status,
      priority: data.priority,
      campaignId: data.campaignId || null,
      assigneeId: data.assigneeId || null,
      dueDate: toDate(formData.get("dueDate")),
      scheduledAt: toDate(formData.get("scheduledAt")),
    },
  });

  redirect(`/tasks/${taskId}`);
}

export async function updateTaskStatusAction(formData: FormData) {
  const user = await requireSessionUser();
  const taskId = formData.get("taskId")?.toString();
  const status = formData.get("status")?.toString();
  if (!taskId || !status || !TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number])) {
    return;
  }

  await prisma.task.updateMany({
    where: { id: taskId, organizationId: user.organizationId },
    data: { status },
  });
}

export async function deleteTaskAction(taskId: string) {
  const user = await requireSessionUser();
  await prisma.task.deleteMany({ where: { id: taskId, organizationId: user.organizationId } });
  redirect("/board");
}

export async function addCommentAction(taskId: string, formData: FormData) {
  const user = await requireSessionUser();
  const body = optionalString(formData.get("body"));
  if (!body) return;

  const task = await prisma.task.findFirst({
    where: { id: taskId, organizationId: user.organizationId },
    select: { id: true },
  });
  if (!task) return;

  await prisma.comment.create({
    data: { taskId, authorId: user.id, body },
  });
}

const campaignSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().max(5000).optional().default(""),
  objective: z.string().trim().max(500).optional().default(""),
  status: z.enum(CAMPAIGN_STATUSES),
  budget: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export async function createCampaignAction(formData: FormData) {
  const user = await requireSessionUser();
  const parsed = campaignSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    objective: formData.get("objective") ?? "",
    status: formData.get("status"),
    budget: optionalString(formData.get("budget")),
    startDate: optionalString(formData.get("startDate")),
    endDate: optionalString(formData.get("endDate")),
  });

  const campaign = await prisma.campaign.create({
    data: {
      organizationId: user.organizationId,
      ownerId: user.id,
      name: parsed.name,
      description: parsed.description ?? "",
      objective: parsed.objective ?? "",
      status: parsed.status,
      budget: parsed.budget ? Number(parsed.budget) : null,
      startDate: toDate(formData.get("startDate")),
      endDate: toDate(formData.get("endDate")),
    },
  });

  redirect(`/campaigns/${campaign.id}`);
}

export async function updateCampaignAction(campaignId: string, formData: FormData) {
  const user = await requireSessionUser();
  const parsed = campaignSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    objective: formData.get("objective") ?? "",
    status: formData.get("status"),
    budget: optionalString(formData.get("budget")),
    startDate: optionalString(formData.get("startDate")),
    endDate: optionalString(formData.get("endDate")),
  });

  await prisma.campaign.updateMany({
    where: { id: campaignId, organizationId: user.organizationId },
    data: {
      name: parsed.name,
      description: parsed.description ?? "",
      objective: parsed.objective ?? "",
      status: parsed.status,
      budget: parsed.budget ? Number(parsed.budget) : null,
      startDate: toDate(formData.get("startDate")),
      endDate: toDate(formData.get("endDate")),
    },
  });

  redirect(`/campaigns/${campaignId}`);
}

export async function inviteTeammateAction(formData: FormData) {
  const user = await requireSessionUser();
  const name = optionalString(formData.get("name"));
  const email = optionalString(formData.get("email"))?.toLowerCase();

  if (!name || !email) {
    redirect(`/team?error=${encodeURIComponent("Name and email are required.")}`);
  }

  const existingMembership = await prisma.membership.findFirst({
    where: { organizationId: user.organizationId, user: { email } },
  });
  if (existingMembership) {
    redirect(`/team?error=${encodeURIComponent("That person is already on your team.")}`);
  }

  let teammate = await prisma.user.findUnique({ where: { email } });
  let tempPassword: string | null = null;

  if (!teammate) {
    tempPassword = crypto.randomBytes(9).toString("base64url");
    teammate = await prisma.user.create({
      data: { name, email, passwordHash: await hashPassword(tempPassword) },
    });
  }

  await prisma.membership.create({
    data: { userId: teammate.id, organizationId: user.organizationId, role: "MEMBER" },
  });

  const params = new URLSearchParams({ invited: teammate.email });
  if (tempPassword) params.set("tempPassword", tempPassword);
  redirect(`/team?${params.toString()}`);
}
