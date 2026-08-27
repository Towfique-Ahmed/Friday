import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

import { PageHeader } from "@/components/layout/page-header";
import { ChannelBadge, TypeBadge } from "@/components/tasks/task-badges";
import { Card } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

function parseMonth(param?: string): Date {
  if (param) {
    const [year, month] = param.split("-").map(Number);
    if (year && month) return new Date(year, month - 1, 1);
  }
  return startOfMonth(new Date());
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const user = await requireSessionUser();
  const { month: monthParam } = await searchParams;
  const monthStart = parseMonth(monthParam);
  const monthEnd = endOfMonth(monthStart);

  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const tasks = await prisma.task.findMany({
    where: {
      organizationId: user.organizationId,
      OR: [
        { scheduledAt: { gte: gridStart, lte: gridEnd } },
        { dueDate: { gte: gridStart, lte: gridEnd } },
      ],
    },
    include: { assignee: true },
  });

  const tasksByDay = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const date = task.scheduledAt ?? task.dueDate;
    if (!date) continue;
    const key = format(date, "yyyy-MM-dd");
    const bucket = tasksByDay.get(key) ?? [];
    bucket.push(task);
    tasksByDay.set(key, bucket);
  }

  const prevMonth = format(subMonths(monthStart, 1), "yyyy-MM");
  const nextMonth = format(addMonths(monthStart, 1), "yyyy-MM");

  return (
    <div>
      <PageHeader
        title="Content calendar"
        description="Everything scheduled to publish or due this month, across every channel."
        actions={
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/calendar?month=${prevMonth}`} className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 hover:bg-ink-100">
              ←
            </Link>
            <span className="w-32 text-center font-medium text-ink-700">
              {format(monthStart, "MMMM yyyy")}
            </span>
            <Link href={`/calendar?month=${nextMonth}`} className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 hover:bg-ink-100">
              →
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-ink-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, monthStart);

          return (
            <Card
              key={key}
              className={cn(
                "min-h-[110px] p-2",
                !inMonth && "bg-ink-100/60 opacity-60 shadow-none",
              )}
            >
              <p
                className={cn(
                  "mb-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  isToday(day) ? "bg-brand-600 font-semibold text-white" : "text-ink-500",
                )}
              >
                {format(day, "d")}
              </p>
              <div className="flex flex-col gap-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block truncate rounded bg-ink-100 px-1.5 py-1 text-[11px] font-medium text-ink-700 hover:bg-ink-200"
                    title={task.title}
                  >
                    {task.title}
                  </Link>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[11px] text-ink-400">+{dayTasks.length - 3} more</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <TypeBadge type="CONTENT" />
        <TypeBadge type="SOCIAL" />
        <TypeBadge type="EMAIL" />
        <ChannelBadge channel="INSTAGRAM" />
        <ChannelBadge channel="BLOG" />
      </div>
    </div>
  );
}
