# Drop OX Portal

Recipient-facing application for uploading documents, running validation checks, and tracking validation status.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Prisma + PostgreSQL
- better-auth (Microsoft provider)
- Azure Blob Storage (document storage)
- Azure OpenAI (optional AI validation when enabled per document type)
- Shared UI package: `@drop-ox/ox-ui`

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database
- Azure Storage account

## Environment Variables

Create an `.env` file in this directory:

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
BETTER_AUTH_URL="http://localhost:3001"
BETTER_AUTH_SECRET="your-secret"
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."
MICROSOFT_TENANT_ID="..."

# Blob Storage
AZURE_STORAGE_CONNECTION_STRING="..."
AZURE_STORAGE_CONTAINER_NAME="documents"

# Optional AI validation (required only when useAi=true for a document type)
AZURE_OPENAI_ENDPOINT="https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=2024-02-15-preview"
AZURE_OPENAI_API_KEY="..."
```

## Install

```bash
npm install
```

If shared UI components changed in `../ox-ui`, relink them:

```bash
npm run ui:refresh
```

## Run

```bash
npm run dev
```

Notes:

- The dev command uses webpack (`next dev --webpack`) for local reliability.
- If you have stale local processes, stop old `next dev` instances before starting again.

Default URL: `http://localhost:3000`

## Database Commands

```bash
npm run db:generate
npm run db:push
```

## Quality

```bash
npm run lint
```

## Production

```bash
npm run build
npm run start
```
