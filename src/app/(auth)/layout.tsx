import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-bold">
          F
        </span>
        <span className="text-lg font-semibold">Friday</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-ink-800 bg-ink-900 p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
