# @drop-ox/ox-ui

Shared UI component package used by both Drop OX apps (`admin` and `portal`).

## Purpose

`@drop-ox/ox-ui` centralizes reusable UI primitives and keeps visual behavior consistent across applications.

Current exports include:

- `Breadcrumbs`
- `Button`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `ConfirmationDialog`
- `Table`, `TableHead`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell`
- `Text`

## Tech Stack

- TypeScript (ESM)
- React component library (no separate runtime framework)
- Build output in `dist/`

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

This compiles `src/` into `dist/` and updates type declarations.

## Sync to Consumers

After changing components, rebuild and relink into both apps:

```bash
npm run sync:consumers
```

What this does:

1. Builds `@drop-ox/ox-ui`.
2. Runs `admin` `ui:refresh`.
3. Runs `portal` `ui:refresh`.

## Local Development Workflow

1. Make component changes in `src/`.
2. Run `npm run sync:consumers`.
3. Restart dev servers in consumer apps if needed.

## Package Notes

- Package name: `@drop-ox/ox-ui`
- Entry points:
  - `main`: `./dist/index.js`
  - `types`: `./dist/index.d.ts`
- Peer dependencies:
  - `next` ^16
  - `react` ^19
  - `react-dom` ^19
