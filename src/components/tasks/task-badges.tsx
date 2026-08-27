import { Badge } from "@/components/ui/badge";
import { CAMPAIGN_STATUS_STYLES, PRIORITY_STYLES, STATUS_STYLES, TYPE_STYLES } from "@/lib/badges";
import {
  CAMPAIGN_STATUS_LABELS,
  CHANNEL_LABELS,
  type Channel,
  type CampaignStatus,
  PRIORITY_LABELS,
  type Priority,
  TASK_STATUS_LABELS,
  type TaskStatus,
  TASK_TYPE_LABELS,
  type TaskType,
} from "@/lib/marketing";

export function StatusBadge({ status }: { status: string }) {
  const key = status as TaskStatus;
  return (
    <Badge className={STATUS_STYLES[key] ?? "bg-ink-100 text-ink-600"}>
      {TASK_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const key = priority as Priority;
  return (
    <Badge className={PRIORITY_STYLES[key] ?? "bg-ink-100 text-ink-600"}>
      {PRIORITY_LABELS[key] ?? priority}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const key = type as TaskType;
  return (
    <Badge className={TYPE_STYLES[key] ?? "bg-ink-100 text-ink-600"}>
      {TASK_TYPE_LABELS[key] ?? type}
    </Badge>
  );
}

export function ChannelBadge({ channel }: { channel: string }) {
  const key = channel as Channel;
  return (
    <Badge className="bg-ink-100 text-ink-600">{CHANNEL_LABELS[key] ?? channel}</Badge>
  );
}

export function CampaignStatusBadge({ status }: { status: string }) {
  const key = status as CampaignStatus;
  return (
    <Badge className={CAMPAIGN_STATUS_STYLES[key] ?? "bg-ink-100 text-ink-600"}>
      {CAMPAIGN_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}
