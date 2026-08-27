import type { Prisma } from "@prisma/client";

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    assignee: true;
    campaign: true;
    createdBy: true;
  };
}>;

export type TaskWithComments = Prisma.TaskGetPayload<{
  include: {
    assignee: true;
    campaign: true;
    createdBy: true;
    comments: { include: { author: true } };
  };
}>;

export type CampaignWithTasks = Prisma.CampaignGetPayload<{
  include: {
    owner: true;
    tasks: true;
  };
}>;

export type OrgMember = Prisma.MembershipGetPayload<{
  include: { user: true };
}>;
