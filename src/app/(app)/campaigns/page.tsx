import Link from "next/link";
import { format } from "date-fns";

import { PageHeader } from "@/components/layout/page-header";
import { CampaignStatusBadge } from "@/components/tasks/task-badges";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DONE_STATUSES = new Set(["DONE", "PUBLISHED"]);

export default async function CampaignsPage() {
  const user = await requireSessionUser();

  const campaigns = await prisma.campaign.findMany({
    where: { organizationId: user.organizationId },
    include: { owner: true, tasks: { select: { status: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Every initiative your marketing team is running, with the work underneath it."
        actions={<LinkButton href="/campaigns/new">+ New campaign</LinkButton>}
      />

      {campaigns.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-ink-500">
            No campaigns yet. Create your first one to start organizing work.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const total = campaign.tasks.length;
            const done = campaign.tasks.filter((t) => DONE_STATUSES.has(t.status)).length;
            const progress = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <Card className="h-full p-5 transition-shadow hover:shadow-card">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink-900">{campaign.name}</h3>
                    <CampaignStatusBadge status={campaign.status} />
                  </div>
                  {campaign.objective && (
                    <p className="mb-3 line-clamp-2 text-sm text-ink-500">{campaign.objective}</p>
                  )}

                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-xs text-ink-400">
                      <span>{done} of {total} tasks done</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink-400">
                    <span>
                      {campaign.startDate ? format(campaign.startDate, "MMM d") : "No start"} –{" "}
                      {campaign.endDate ? format(campaign.endDate, "MMM d") : "No end"}
                    </span>
                    {campaign.owner && (
                      <Avatar name={campaign.owner.name} color={campaign.owner.avatarColor} size="sm" />
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
