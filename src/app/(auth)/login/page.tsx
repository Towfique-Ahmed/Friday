import Link from "next/link";

import { loginAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Label } from "@/components/ui/field";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-ink-400">Sign in to your marketing workspace.</p>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form action={loginAction}>
        <FieldGroup>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </FieldGroup>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        New to Friday?{" "}
        <Link href="/register" className="font-medium text-brand-300 hover:text-brand-200">
          Create a workspace
        </Link>
      </p>
    </div>
  );
}
