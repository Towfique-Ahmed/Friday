import Link from "next/link";
import { notFound } from "next/navigation";

import { updateCampaignAction } from "@/app/(app)/actions";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { PageHeader } from "@/components/layout/page-header";
import { PriorityBadge, StatusBadge, TypeBadge } from "@/components/tasks/task-badges";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireSessionUser();
  const { id } = await params;

  const campaign = await prisma.campaign.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      owner: true,
      tasks: { include: { assignee: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!campaign) notFound();

  const boundUpdate = updateCampaignAction.bind(null, campaign.id);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <PageHeader title="Campaign details" />
        <Card className="p-6">
          <CampaignForm
            action={boundUpdate}
            submitLabel="Save changes"
            defaultValues={{
              name: campaign.name,
              description: campaign.description,
              objective: campaign.objective,
              status: campaign.status,
              budget: campaign.budget,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
            }}
          />
        </Card>
      </div>

      <div className="lg:col-span-2">
        <PageHeader
          title={`Tasks in ${campaign.name}`}
          description={`${campaign.tasks.length} task${campaign.tasks.length === 1 ? "" : "s"} in this campaign`}
          actions={
            <LinkButton href={`/tasks/new?campaignId=${campaign.id}`}>+ Add task</LinkButton>
          }
        />

        {campaign.tasks.length === 0 ? (
          <Card className="p-8 text-center text-sm text-ink-500">
            No tasks yet for this campaign.
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {campaign.tasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <Card className="flex flex-wrap items-center justify-between gap-2 p-3.5 transition-shadow hover:shadow-card">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink-800">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex flex-none items-center gap-1.5">
                    <TypeBadge type={task.type} />
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
