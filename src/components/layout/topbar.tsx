import { logoutAction } from "@/app/(app)/actions";
import { Avatar } from "@/components/ui/avatar";
import type { SessionUser } from "@/lib/auth";

export function Topbar({ user, title }: { user: SessionUser; title?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-ink-200 bg-white px-6 py-3.5">
      <div>
        {title && <h1 className="text-lg font-semibold text-ink-900">{title}</h1>}
        <p className="text-xs text-ink-400">{user.organizationName}</p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar name={user.name} color={user.avatarColor} />
        <div className="hidden text-sm leading-tight sm:block">
          <p className="font-medium text-ink-800">{user.name}</p>
          <p className="text-xs text-ink-400">{user.email}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-100 hover:text-ink-800"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
