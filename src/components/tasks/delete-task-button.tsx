"use client";

import { Button } from "@/components/ui/button";

export function DeleteTaskButton({ action }: { action: () => void | Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("Delete this task? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        Delete task
      </Button>
    </form>
  );
}
