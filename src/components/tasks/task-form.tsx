import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/field";
import {
  CHANNELS,
  CHANNEL_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_TYPES,
  TASK_TYPE_LABELS,
} from "@/lib/marketing";

type Option = { id: string; name: string };

function toInputDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function TaskForm({
  action,
  campaigns,
  members,
  defaultValues,
  submitLabel = "Create task",
}: {
  action: (formData: FormData) => void | Promise<void>;
  campaigns: Option[];
  members: Option[];
  defaultValues?: {
    title?: string;
    description?: string;
    type?: string;
    channel?: string | null;
    status?: string;
    priority?: string;
    campaignId?: string | null;
    assigneeId?: string | null;
    dueDate?: Date | null;
    scheduledAt?: Date | null;
  };
  submitLabel?: string;
}) {
  const values = defaultValues ?? {};

  return (
    <form action={action}>
      <FieldGroup>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={values.title}
          placeholder="Write Q3 launch blog post"
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={values.description}
          placeholder="Briefs, links, context for whoever picks this up…"
        />
      </FieldGroup>

      <div className="grid grid-cols-2 gap-3">
        <FieldGroup>
          <Label htmlFor="type">Work type</Label>
          <Select id="type" name="type" defaultValue={values.type ?? "CONTENT"}>
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {TASK_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="channel">Channel</Label>
          <Select id="channel" name="channel" defaultValue={values.channel ?? ""}>
            <option value="">—</option>
            {CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {CHANNEL_LABELS[channel]}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={values.status ?? "BACKLOG"}>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="priority">Priority</Label>
          <Select id="priority" name="priority" defaultValue={values.priority ?? "MEDIUM"}>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="campaignId">Campaign</Label>
          <Select id="campaignId" name="campaignId" defaultValue={values.campaignId ?? ""}>
            <option value="">No campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="assigneeId">Assignee</Label>
          <Select id="assigneeId" name="assigneeId" defaultValue={values.assigneeId ?? ""}>
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="dueDate">Due date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={toInputDate(values.dueDate)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="scheduledAt">Publish / scheduled date</Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="date"
            defaultValue={toInputDate(values.scheduledAt)}
          />
        </FieldGroup>
      </div>

      <Button type="submit" className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
