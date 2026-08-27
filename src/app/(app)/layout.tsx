import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { requireSessionUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser();

  return (
    <div className="flex min-h-screen bg-ink-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
