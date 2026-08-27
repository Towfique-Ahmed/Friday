"use client";

import { useTransition } from "react";

import { updateTaskStatusAction } from "@/app/(app)/actions";
import { TASK_STATUSES, TASK_STATUS_LABELS } from "@/lib/marketing";

export function StatusQuickSelect({ taskId, status }: { taskId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(event) => {
        const formData = new FormData();
        formData.set("taskId", taskId);
        formData.set("status", event.target.value);
        startTransition(() => {
          updateTaskStatusAction(formData);
        });
      }}
      className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs text-ink-700 outline-none focus:border-brand-400"
      onClick={(event) => event.preventDefault()}
    >
      {TASK_STATUSES.map((value) => (
        <option key={value} value={value}>
          {TASK_STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
