# Phase 01 — Workspace Base Config

## Overview
Pin runtime + tooling versions, add Nest plugin, set base tsconfig + lint.

## Steps
1. `package.json`: add `"engines": { "node": ">=24", "pnpm": ">=10" }`, `"packageManager": "pnpm@10.x.x"`.
2. Add devDeps: `@nx/nest @nx/node @nx/eslint @nx/jest @nx/workspace eslint typescript@5.9 jest @types/node@^24`.
3. `nx.json`: add `@nx/eslint`, `@nx/jest` plugins; `release` placeholder (configured in phase 07).
4. `tsconfig.base.json`: `target: ES2023`, `module: NodeNext`, `moduleResolution: NodeNext`, `strict: true`, `paths: {}` (Nx will populate).
5. Root `.eslintrc` (flat config), `.prettierrc` already exists — verify.
6. `pnpm-workspace.yaml`: confirm `packages/**` glob.
7. Add `.gitignore`: `dist`, `node_modules`, `coverage`, `**/src/generated/**`, `.nx/cache`.
8. Add `.nvmrc` `24` and `.node-version` `24`.

## Files
- `package.json` (modify)
- `nx.json` (modify)
- `tsconfig.base.json` (modify)
- `.gitignore` `.nvmrc` `.node-version` (create)

## Validation
- `pnpm install` clean
- `pnpm nx report` shows installed plugins
- `node -v` ≥ 24

## Done When
Workspace ready to scaffold libs + apps.
