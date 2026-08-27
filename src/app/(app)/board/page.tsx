import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatusQuickSelect } from "@/components/tasks/status-quick-select";
import { TaskCard } from "@/components/tasks/task-card";
import { requireSessionUser } from "@/lib/auth";
import { BOARD_COLUMNS, TASK_STATUS_LABELS } from "@/lib/marketing";
import { prisma } from "@/lib/prisma";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ campaignId?: string }>;
}) {
  const user = await requireSessionUser();
  const { campaignId } = await searchParams;

  const [tasks, campaigns] = await Promise.all([
    prisma.task.findMany({
      where: {
        organizationId: user.organizationId,
        ...(campaignId ? { campaignId } : {}),
      },
      include: { assignee: true, campaign: true, createdBy: true },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    }),
    prisma.campaign.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const columns = BOARD_COLUMNS.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.status === status),
  }));

  return (
    <div>
      <PageHeader
        title="Board"
        description="Drag work through your marketing pipeline, from idea to published."
        actions={<LinkButton href="/tasks/new">+ New task</LinkButton>}
      />

      {campaigns.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-400">Filter:</span>
          <a
            href="/board"
            className={`rounded-full px-3 py-1 ${!campaignId ? "bg-brand-600 text-white" : "bg-white text-ink-600 border border-ink-200"}`}
          >
            All campaigns
          </a>
          {campaigns.map((campaign) => (
            <a
              key={campaign.id}
              href={`/board?campaignId=${campaign.id}`}
              className={`rounded-full px-3 py-1 ${campaignId === campaign.id ? "bg-brand-600 text-white" : "bg-white text-ink-600 border border-ink-200"}`}
            >
              {campaign.name}
            </a>
          ))}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.status} className="w-72 flex-none">
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-ink-700">
                {TASK_STATUS_LABELS[column.status]}
              </h2>
              <span className="rounded-full bg-ink-200 px-2 py-0.5 text-xs font-medium text-ink-600">
                {column.tasks.length}
              </span>
            </div>
            <div className="flex min-h-[120px] flex-col gap-2 rounded-xl bg-ink-100/60 p-2">
              {column.tasks.map((task) => (
                <div key={task.id} className="group relative">
                  <TaskCard task={task} />
                  <div className="mt-1 flex justify-end">
                    <StatusQuickSelect taskId={task.id} status={task.status} />
                  </div>
                </div>
              ))}
              {column.tasks.length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-ink-400">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
