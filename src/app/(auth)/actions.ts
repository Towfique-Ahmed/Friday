"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const registerSchema = z.object({
  workspaceName: z.string().trim().min(2, "Workspace name is too short").max(80),
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    workspaceName: formData.get("workspaceName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(`/register?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { workspaceName, name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(`/register?error=${encodeURIComponent("An account with that email already exists.")}`);
  }

  const baseSlug = slugify(workspaceName) || "workspace";
  let slug = baseSlug;
  let attempt = 0;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt + 1}`;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: workspaceName, slug },
    });
    const createdUser = await tx.user.create({
      data: { name, email, passwordHash },
    });
    await tx.membership.create({
      data: { userId: createdUser.id, organizationId: organization.id, role: "OWNER" },
    });
    return createdUser;
  });

  await createSession(user.id);
  redirect("/dashboard");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect(`/login?error=${encodeURIComponent("Incorrect email or password.")}`);
  }

  await createSession(user.id);
  redirect("/dashboard");
}
