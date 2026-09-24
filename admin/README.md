# Drop OX Admin

Admin application for managing document types, reviewing incoming document requests, and supporting operations workflows.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Prisma + PostgreSQL
- better-auth (Microsoft provider)
- Shared UI package: `@drop-ox/ox-ui`

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database

## Environment Variables

Create an `.env` file in this directory with the following values:

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret"
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."
MICROSOFT_TENANT_ID="..."

# Email
SMTP_SERVICE="gmail"
SMTP_USER="you@example.com"
SMTP_PASSWORD="app-password"
```

## Install

```bash
npm install
```

If you changed shared UI code in `../ox-ui`, refresh the linked dependency:

```bash
npm run ui:refresh
```

## Run

```bash
npm run dev
```

Default URL: `http://localhost:3000`

## Database Commands

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Quality and Tests

```bash
npm run lint
npm run test
npm run test:watch
```

## Production

```bash
npm run build
npm run start
```
