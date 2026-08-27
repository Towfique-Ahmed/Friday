import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Avatar({
  name,
  color,
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-full font-semibold text-white",
        size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs",
      )}
      style={{ backgroundColor: color ?? "#5d4bff" }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}
