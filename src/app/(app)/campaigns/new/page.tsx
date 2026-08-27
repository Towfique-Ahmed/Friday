import { createCampaignAction } from "@/app/(app)/actions";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default function NewCampaignPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New campaign" description="Set the goal, budget, and timeline for this initiative." />
      <Card className="p-6">
        <CampaignForm action={createCampaignAction} />
      </Card>
    </div>
  );
}
