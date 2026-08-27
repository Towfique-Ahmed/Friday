import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Label, Select, Textarea } from "@/components/ui/field";
import { CAMPAIGN_STATUSES, CAMPAIGN_STATUS_LABELS } from "@/lib/marketing";

function toInputDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function CampaignForm({
  action,
  defaultValues,
  submitLabel = "Create campaign",
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: {
    name?: string;
    description?: string;
    objective?: string;
    status?: string;
    budget?: number | null;
    startDate?: Date | null;
    endDate?: Date | null;
  };
  submitLabel?: string;
}) {
  const values = defaultValues ?? {};

  return (
    <form action={action}>
      <FieldGroup>
        <Label htmlFor="name">Campaign name</Label>
        <Input id="name" name="name" required defaultValue={values.name} placeholder="Q3 Product Launch" />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="objective">Objective</Label>
        <Input
          id="objective"
          name="objective"
          defaultValue={values.objective}
          placeholder="Drive 5,000 signups before September"
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={values.description}
          placeholder="Strategy, audience, key messages…"
        />
      </FieldGroup>

      <div className="grid grid-cols-2 gap-3">
        <FieldGroup>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={values.status ?? "PLANNING"}>
            {CAMPAIGN_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CAMPAIGN_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="budget">Budget (USD)</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            min={0}
            step="0.01"
            defaultValue={values.budget ?? undefined}
            placeholder="10000"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={toInputDate(values.startDate)} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="endDate">End date</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={toInputDate(values.endDate)} />
        </FieldGroup>
      </div>

      <Button type="submit" className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
