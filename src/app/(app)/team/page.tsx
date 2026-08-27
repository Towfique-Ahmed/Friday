import { inviteTeammateAction } from "@/app/(app)/actions";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup, Input, Label } from "@/components/ui/field";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; invited?: string; tempPassword?: string }>;
}) {
  const user = await requireSessionUser();
  const { error, invited, tempPassword } = await searchParams;

  const members = await prisma.membership.findMany({
    where: { organizationId: user.organizationId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PageHeader
          title="Team"
          description={`${members.length} member${members.length === 1 ? "" : "s"} in ${user.organizationName}`}
        />

        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <Card key={member.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <Avatar name={member.user.name} color={member.user.avatarColor} />
                <div>
                  <p className="text-sm font-medium text-ink-800">{member.user.name}</p>
                  <p className="text-xs text-ink-400">{member.user.email}</p>
                </div>
              </div>
              <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
                {member.role}
              </span>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 mt-1 text-sm font-semibold text-ink-700 lg:mt-11">Invite a teammate</h2>
        <Card className="p-5">
          {error && (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}
          {invited && (
            <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <p className="font-medium">{invited} was added to the team.</p>
              {tempPassword && (
                <p className="mt-1">
                  Temporary password: <code className="font-mono">{tempPassword}</code>
                  <br />
                  Share it securely — they should change it after signing in.
                </p>
              )}
            </div>
          )}
          <form action={inviteTeammateAction}>
            <FieldGroup>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Alex Chen" />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="alex@company.com" />
            </FieldGroup>
            <Button type="submit" className="w-full">
              Add to team
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
