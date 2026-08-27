# Friday

Task management, built specifically for marketing teams and marketers — not a generic
project board with your logo on it.

Friday brings campaigns, content, social media, email, SEO, paid ads, design, events, and
PR work into one workspace, with a pipeline shaped around how marketing teams actually
review and ship: **Backlog → To Do → In Progress → In Review → Approved → Scheduled →
Published → Done**.

## Features

- **Campaigns** — goals, budget, timeline, and every task rolling up underneath them.
- **Kanban board** — the marketing-shaped pipeline above, with quick status changes and
  per-campaign filtering.
- **Content & social calendar** — a monthly view of everything scheduled to publish or due,
  across every channel.
- **Task detail** — full editing, channel/work-type/priority tagging, assignees, due and
  scheduled dates, and a comment thread for approvals and feedback.
- **Team workspace** — invite teammates into your organization; each workspace is isolated
  (multi-tenant) so teams never see each other's data.
- **Marketing-specific vocabulary** — work types (Content, Social, Email, SEO, Paid Ads,
  Design, Event, PR, Analytics) and channels (Instagram, Facebook, X, LinkedIn, TikTok,
  YouTube, Blog, Email, Website) baked in throughout.

## Stack

- [Next.js 14](https://nextjs.org) (App Router, Server Actions) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) — SQLite by default (zero setup), swappable to PostgreSQL
- Cookie-based sessions signed with [jose](https://github.com/panva/jose) (JWT) +
  [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing — no external auth
  provider required

## Getting started

```bash
npm install
cp .env.example .env
npm run db:push    # create the SQLite database from prisma/schema.prisma
npm run db:seed     # optional: seed a demo workspace with campaigns and tasks
npm run dev
```

Visit `http://localhost:3000`. Either register a new workspace at `/register`, or — if you
ran the seed script — sign in with any of these demo accounts (password `password123`):

- `amara@acme-marketing.demo` (owner)
- `ben@acme-marketing.demo`
- `chloe@acme-marketing.demo`
- `devon@acme-marketing.demo`

## Scripts

| Command             | Description                                   |
| -------------------- | ---------------------------------------------- |
| `npm run dev`         | Start the dev server                           |
| `npm run build`       | Production build                               |
| `npm run start`       | Run the production build                       |
| `npm run typecheck`   | TypeScript, no emit                            |
| `npm run db:push`     | Sync the database with `prisma/schema.prisma`  |
| `npm run db:seed`     | Seed a demo workspace                          |

## Data model

- `Organization` — a workspace/tenant. Every other model is scoped to one.
- `User` / `Membership` — a user can belong to an organization with a role (`OWNER`,
  `ADMIN`, `MEMBER`).
- `Campaign` — objective, budget, timeline, status, owner.
- `Task` — the unit of marketing work: type, channel, status, priority, assignee, due /
  scheduled dates, optional campaign link.
- `Comment` — a threaded note on a task, used for review and approval conversations.

See `prisma/schema.prisma` for the full schema.

## Running against PostgreSQL

The app defaults to SQLite so it runs with zero setup. For a production-style setup:

1. `docker compose up -d` to start a local Postgres instance (see `docker-compose.yml`).
2. In `prisma/schema.prisma`, change the datasource `provider` from `"sqlite"` to
   `"postgresql"`.
3. Point `DATABASE_URL` in `.env` at Postgres (an example is commented in `.env.example`).
4. `npm run db:push`.
