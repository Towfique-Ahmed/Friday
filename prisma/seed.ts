import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const AVATAR_COLORS = ["#5d4bff", "#e0663d", "#1a9e78", "#c2409c", "#2f7fd6"];

async function main() {
  const existing = await prisma.organization.findUnique({ where: { slug: "acme-marketing" } });
  if (existing) {
    console.log("Demo data already exists — skipping seed. Delete prisma/dev.db to reseed.");
    return;
  }

  const passwordHash = await bcrypt.hash("password123", 10);

  const organization = await prisma.organization.create({
    data: { name: "Acme Marketing", slug: "acme-marketing" },
  });

  const [amara, ben, chloe, devon] = await Promise.all(
    [
      { name: "Amara Odom", email: "amara@acme-marketing.demo" },
      { name: "Ben Ortiz", email: "ben@acme-marketing.demo" },
      { name: "Chloe Nakamura", email: "chloe@acme-marketing.demo" },
      { name: "Devon Blake", email: "devon@acme-marketing.demo" },
    ].map((u, i) =>
      prisma.user.create({
        data: { ...u, passwordHash, avatarColor: AVATAR_COLORS[i] },
      }),
    ),
  );

  await prisma.membership.createMany({
    data: [
      { userId: amara.id, organizationId: organization.id, role: "OWNER" },
      { userId: ben.id, organizationId: organization.id, role: "ADMIN" },
      { userId: chloe.id, organizationId: organization.id, role: "MEMBER" },
      { userId: devon.id, organizationId: organization.id, role: "MEMBER" },
    ],
  });

  const today = new Date();
  const daysFromNow = (n: number) => new Date(today.getTime() + n * 24 * 60 * 60 * 1000);

  const launchCampaign = await prisma.campaign.create({
    data: {
      organizationId: organization.id,
      ownerId: amara.id,
      name: "Q3 Product Launch",
      objective: "Drive 5,000 signups for the new analytics dashboard before quarter end",
      description:
        "Full-funnel launch: teaser content, launch-day social blitz, email sequence, and a paid push in the final two weeks.",
      status: "ACTIVE",
      budget: 18000,
      startDate: daysFromNow(-10),
      endDate: daysFromNow(20),
    },
  });

  const evergreenCampaign = await prisma.campaign.create({
    data: {
      organizationId: organization.id,
      ownerId: ben.id,
      name: "Evergreen Content & SEO",
      objective: "Grow organic blog traffic 25% quarter-over-quarter",
      description: "Ongoing blog cadence, keyword-targeted refreshes, and backlink outreach.",
      status: "ACTIVE",
      budget: 6000,
      startDate: daysFromNow(-30),
      endDate: null,
    },
  });

  const webinarCampaign = await prisma.campaign.create({
    data: {
      organizationId: organization.id,
      ownerId: chloe.id,
      name: "Fall Webinar Series",
      objective: "Generate 800 qualified leads across three live webinars",
      description: "Three-part webinar series with promo emails, social countdowns, and a paid retargeting layer.",
      status: "PLANNING",
      budget: 9000,
      startDate: daysFromNow(15),
      endDate: daysFromNow(60),
    },
  });

  type TaskSeed = {
    title: string;
    description?: string;
    type: string;
    channel?: string | null;
    status: string;
    priority: string;
    campaignId?: string | null;
    assigneeId?: string | null;
    dueDate?: Date | null;
    scheduledAt?: Date | null;
  };

  const tasks: TaskSeed[] = [
    {
      title: "Write launch announcement blog post",
      description: "Cover the new analytics dashboard, key benefits, and a CTA to the signup page.",
      type: "CONTENT",
      channel: "BLOG",
      status: "IN_REVIEW",
      priority: "HIGH",
      campaignId: launchCampaign.id,
      assigneeId: ben.id,
      dueDate: daysFromNow(2),
      scheduledAt: daysFromNow(3),
    },
    {
      title: "Design launch-day Instagram carousel",
      type: "DESIGN",
      channel: "INSTAGRAM",
      status: "IN_PROGRESS",
      priority: "HIGH",
      campaignId: launchCampaign.id,
      assigneeId: devon.id,
      dueDate: daysFromNow(3),
      scheduledAt: daysFromNow(5),
    },
    {
      title: "Schedule launch-day X thread",
      type: "SOCIAL",
      channel: "X",
      status: "APPROVED",
      priority: "MEDIUM",
      campaignId: launchCampaign.id,
      assigneeId: chloe.id,
      dueDate: daysFromNow(4),
      scheduledAt: daysFromNow(5),
    },
    {
      title: "Build 3-part launch email sequence",
      type: "EMAIL",
      channel: "EMAIL",
      status: "TODO",
      priority: "HIGH",
      campaignId: launchCampaign.id,
      assigneeId: amara.id,
      dueDate: daysFromNow(6),
      scheduledAt: daysFromNow(7),
    },
    {
      title: "Set up launch retargeting ad set",
      type: "PAID_ADS",
      channel: "FACEBOOK",
      status: "TODO",
      priority: "MEDIUM",
      campaignId: launchCampaign.id,
      assigneeId: ben.id,
      dueDate: daysFromNow(8),
    },
    {
      title: "Draft launch-day press release",
      type: "PR",
      channel: "WEBSITE",
      status: "BACKLOG",
      priority: "MEDIUM",
      campaignId: launchCampaign.id,
      assigneeId: amara.id,
      dueDate: daysFromNow(9),
    },
    {
      title: "Publish teaser LinkedIn post",
      type: "SOCIAL",
      channel: "LINKEDIN",
      status: "PUBLISHED",
      priority: "MEDIUM",
      campaignId: launchCampaign.id,
      assigneeId: chloe.id,
      dueDate: daysFromNow(-3),
      scheduledAt: daysFromNow(-3),
    },
    {
      title: "Record product teaser video for YouTube",
      type: "CONTENT",
      channel: "YOUTUBE",
      status: "SCHEDULED",
      priority: "HIGH",
      campaignId: launchCampaign.id,
      assigneeId: devon.id,
      dueDate: daysFromNow(1),
      scheduledAt: daysFromNow(4),
    },
    {
      title: "Refresh 'marketing automation 101' post for target keyword",
      type: "SEO",
      channel: "BLOG",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      campaignId: evergreenCampaign.id,
      assigneeId: ben.id,
      dueDate: daysFromNow(5),
    },
    {
      title: "Outreach to 10 backlink prospects",
      type: "SEO",
      channel: "OTHER",
      status: "TODO",
      priority: "LOW",
      campaignId: evergreenCampaign.id,
      assigneeId: ben.id,
      dueDate: daysFromNow(10),
    },
    {
      title: "Publish weekly newsletter roundup",
      type: "EMAIL",
      channel: "EMAIL",
      status: "DONE",
      priority: "LOW",
      campaignId: evergreenCampaign.id,
      assigneeId: amara.id,
      dueDate: daysFromNow(-1),
      scheduledAt: daysFromNow(-1),
    },
    {
      title: "Pull monthly organic traffic report",
      type: "ANALYTICS",
      channel: "OTHER",
      status: "TODO",
      priority: "MEDIUM",
      campaignId: evergreenCampaign.id,
      assigneeId: chloe.id,
      dueDate: daysFromNow(6),
    },
    {
      title: "Write webinar #1 landing page copy",
      type: "CONTENT",
      channel: "WEBSITE",
      status: "TODO",
      priority: "HIGH",
      campaignId: webinarCampaign.id,
      assigneeId: chloe.id,
      dueDate: daysFromNow(12),
    },
    {
      title: "Design webinar countdown Stories",
      type: "DESIGN",
      channel: "INSTAGRAM",
      status: "BACKLOG",
      priority: "MEDIUM",
      campaignId: webinarCampaign.id,
      assigneeId: devon.id,
      dueDate: daysFromNow(18),
    },
    {
      title: "Book guest speaker for webinar #2",
      type: "EVENT",
      channel: "OTHER",
      status: "BACKLOG",
      priority: "HIGH",
      campaignId: webinarCampaign.id,
      assigneeId: amara.id,
      dueDate: daysFromNow(20),
    },
    {
      title: "Set up TikTok teaser for webinar series",
      type: "SOCIAL",
      channel: "TIKTOK",
      status: "BACKLOG",
      priority: "LOW",
      campaignId: webinarCampaign.id,
      assigneeId: devon.id,
      dueDate: daysFromNow(22),
    },
    {
      title: "Audit brand hashtags across channels",
      type: "OTHER",
      channel: "OTHER",
      status: "BACKLOG",
      priority: "LOW",
      campaignId: null,
      assigneeId: null,
      dueDate: null,
    },
  ];

  for (const [index, taskData] of tasks.entries()) {
    const task = await prisma.task.create({
      data: {
        organizationId: organization.id,
        createdById: amara.id,
        position: index,
        title: taskData.title,
        description: taskData.description ?? "",
        type: taskData.type,
        channel: taskData.channel ?? null,
        status: taskData.status,
        priority: taskData.priority,
        campaignId: taskData.campaignId ?? null,
        assigneeId: taskData.assigneeId ?? null,
        dueDate: taskData.dueDate ?? null,
        scheduledAt: taskData.scheduledAt ?? null,
      },
    });

    if (index % 4 === 0) {
      await prisma.comment.create({
        data: {
          taskId: task.id,
          authorId: ben.id,
          body: "Left some notes in the brief doc — let me know if anything's unclear!",
        },
      });
    }
  }

  console.log("Seeded demo workspace 'Acme Marketing'.");
  console.log("Login with any of these (password: password123):");
  for (const u of [amara, ben, chloe, devon]) {
    console.log(`  - ${u.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
