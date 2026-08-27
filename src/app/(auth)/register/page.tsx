import Link from "next/link";

import { registerAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Label } from "@/components/ui/field";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-white">Create your workspace</h1>
      <p className="mb-6 text-sm text-ink-400">
        Set up a home for your marketing team&rsquo;s campaigns and tasks.
      </p>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form action={registerAction}>
        <FieldGroup>
          <Label htmlFor="workspaceName">Workspace / company name</Label>
          <Input
            id="workspaceName"
            name="workspaceName"
            type="text"
            required
            placeholder="Acme Marketing"
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" type="text" required placeholder="Jamie Rivera" />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </FieldGroup>
        <Button type="submit" className="w-full">
          Create workspace
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-300 hover:text-brand-200">
          Sign in
        </Link>
      </p>
    </div>
  );
}
