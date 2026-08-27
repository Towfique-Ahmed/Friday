import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { addCommentAction, deleteTaskAction, updateTaskAction } from "@/app/(app)/actions";
import { PageHeader } from "@/components/layout/page-header";
import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { TaskForm } from "@/components/tasks/task-form";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/field";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSessionUser();
  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      assignee: true,
      campaign: true,
      createdBy: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!task) notFound();

  const [campaigns, members] = await Promise.all([
    prisma.campaign.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.membership.findMany({
      where: { organizationId: user.organizationId },
      include: { user: true },
    }),
  ]);

  const boundUpdate = updateTaskAction.bind(null, task.id);
  const boundDelete = deleteTaskAction.bind(null, task.id);
  const boundComment = addCommentAction.bind(null, task.id);

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PageHeader
          title="Edit task"
          description={`Created by ${task.createdBy.name} · ${formatDistanceToNow(task.createdAt, { addSuffix: true })}`}
          actions={<DeleteTaskButton action={boundDelete} />}
        />
        <Card className="p-6">
          <TaskForm
            action={boundUpdate}
            campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
            members={members.map((m) => ({ id: m.user.id, name: m.user.name }))}
            defaultValues={{
              title: task.title,
              description: task.description,
              type: task.type,
              channel: task.channel,
              status: task.status,
              priority: task.priority,
              campaignId: task.campaignId,
              assigneeId: task.assigneeId,
              dueDate: task.dueDate,
              scheduledAt: task.scheduledAt,
            }}
            submitLabel="Save changes"
          />
        </Card>
      </div>

      <div>
        <h2 className="mb-3 mt-1 text-sm font-semibold text-ink-700 lg:mt-11">Comments</h2>
        <Card className="p-4">
          <div className="mb-4 flex max-h-96 flex-col gap-4 overflow-y-auto">
            {task.comments.length === 0 && (
              <p className="text-sm text-ink-400">No comments yet.</p>
            )}
            {task.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <Avatar name={comment.author.name} color={comment.author.avatarColor} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink-700">
                    {comment.author.name}{" "}
                    <span className="font-normal text-ink-400">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </span>
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm text-ink-700">
                    {comment.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <form action={boundComment} className="flex flex-col gap-2">
            <Textarea name="body" rows={3} placeholder="Leave a note for the team…" required />
            <Button type="submit" size="sm" className="self-end">
              Comment
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
