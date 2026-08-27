import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-ink-100 bg-white shadow-card", className)}>
      {children}
    </div>
  );
}
