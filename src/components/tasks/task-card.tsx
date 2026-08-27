import Link from "next/link";
import { format, isPast } from "date-fns";

import { Avatar } from "@/components/ui/avatar";
import { PriorityBadge, TypeBadge } from "@/components/tasks/task-badges";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/types";

export function TaskCard({ task }: { task: TaskWithRelations }) {
  const overdue = task.dueDate && isPast(task.dueDate) && task.status !== "DONE" && task.status !== "PUBLISHED";

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-lg border border-ink-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-card"
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <TypeBadge type={task.type} />
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="mb-2 text-sm font-medium leading-snug text-ink-900">{task.title}</p>
      {task.campaign && (
        <p className="mb-2 truncate text-xs text-ink-400">↳ {task.campaign.name}</p>
      )}
      <div className="flex items-center justify-between">
        {task.dueDate ? (
          <span className={cn("text-xs", overdue ? "font-medium text-red-600" : "text-ink-400")}>
            {format(task.dueDate, "MMM d")}
          </span>
        ) : (
          <span />
        )}
        {task.assignee && <Avatar name={task.assignee.name} color={task.assignee.avatarColor} size="sm" />}
      </div>
    </Link>
  );
}
