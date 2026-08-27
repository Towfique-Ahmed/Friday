import Link from "next/link";
import { addDays, format, isPast } from "date-fns";

import { PageHeader } from "@/components/layout/page-header";
import { CampaignStatusBadge, PriorityBadge, StatusBadge, TypeBadge } from "@/components/tasks/task-badges";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireSessionUser();
  const organizationId = user.organizationId;
  const weekFromNow = addDays(new Date(), 7);

  const [totalTasks, dueSoonCount, publishedCount, activeCampaigns, upcomingTasks, campaigns] =
    await Promise.all([
      prisma.task.count({ where: { organizationId } }),
      prisma.task.count({
        where: {
          organizationId,
          dueDate: { lte: weekFromNow },
          status: { notIn: ["DONE", "PUBLISHED"] },
        },
      }),
      prisma.task.count({ where: { organizationId, status: "PUBLISHED" } }),
      prisma.campaign.count({ where: { organizationId, status: "ACTIVE" } }),
      prisma.task.findMany({
        where: {
          organizationId,
          status: { notIn: ["DONE", "PUBLISHED"] },
          dueDate: { not: null },
        },
        include: { assignee: true, campaign: true },
        orderBy: { dueDate: "asc" },
        take: 8,
      }),
      prisma.campaign.findMany({
        where: { organizationId },
        include: { tasks: { select: { status: true } } },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const stats = [
    { label: "Total tasks", value: totalTasks },
    { label: "Due within 7 days", value: dueSoonCount },
    { label: "Published", value: publishedCount },
    { label: "Active campaigns", value: activeCampaigns },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's what's moving across your marketing team."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-2xl font-semibold text-ink-900">{stat.value}</p>
            <p className="mt-1 text-xs text-ink-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-700">Due soon</h2>
            <Link href="/board" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              View board →
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <Card className="p-6 text-sm text-ink-500">Nothing due soon. Nice and clear.</Card>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingTasks.map((task) => {
                const overdue = task.dueDate && isPast(task.dueDate);
                return (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <Card className="flex flex-wrap items-center justify-between gap-2 p-3.5 transition-shadow hover:shadow-card">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <TypeBadge type={task.type} />
                        <span className="truncate text-sm font-medium text-ink-800">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex flex-none items-center gap-2">
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                        {task.dueDate && (
                          <span className={cn("text-xs", overdue ? "font-semibold text-red-600" : "text-ink-400")}>
                            {format(task.dueDate, "MMM d")}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-700">Campaigns</h2>
            <Link href="/campaigns" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {campaigns.length === 0 && (
              <Card className="p-6 text-sm text-ink-500">No campaigns yet.</Card>
            )}
            {campaigns.map((campaign) => {
              const total = campaign.tasks.length;
              const done = campaign.tasks.filter((t) => ["DONE", "PUBLISHED"].includes(t.status)).length;
              return (
                <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                  <Card className="p-4 transition-shadow hover:shadow-card">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-ink-800">
                        {campaign.name}
                      </span>
                      <CampaignStatusBadge status={campaign.status} />
                    </div>
                    <p className="text-xs text-ink-400">
                      {total === 0 ? "No tasks yet" : `${done} of ${total} tasks done`}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
