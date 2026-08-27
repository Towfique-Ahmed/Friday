import { createTaskAction } from "@/app/(app)/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/task-form";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ campaignId?: string }>;
}) {
  const user = await requireSessionUser();
  const { campaignId } = await searchParams;

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

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New task" description="Add a piece of marketing work to your pipeline." />
      <Card className="p-6">
        <TaskForm
          action={createTaskAction}
          campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          members={members.map((m) => ({ id: m.user.id, name: m.user.name }))}
          defaultValues={{ campaignId: campaignId ?? null }}
        />
      </Card>
    </div>
  );
}
