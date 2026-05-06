# Phase 01 — Workspace Base Config — Done

## Changes
- `package.json`: added `engines` (node>=24, pnpm>=10), `packageManager: pnpm@10.23.0`, devDeps: `@nx/nest @nx/node @nx/eslint @nx/eslint-plugin @nx/jest @nx/workspace eslint@^9 jest@^29 @types/jest @types/node@^24 typescript-eslint@^8 jsonc-eslint-parser@^2`.
- `nx.json`: added `@nx/eslint/plugin` (lint), `@nx/jest/plugin` (test), `release: {}` placeholder.
- `tsconfig.base.json`: target/lib `es2023`, added `paths: {}`.
- `pnpm-workspace.yaml`: glob `packages/**`.
- `.gitignore`: added `**/src/generated/**`.
- Created `.nvmrc` `24`, `.node-version` `24`, `eslint.config.mjs` (flat config w/ Nx base+TS+JS).

## Validation
- `pnpm install`: clean (1 unrelated peer warn on swc-node wasm runtime).
- `pnpm nx report`: shows `@nx/js/typescript`, `@nx/eslint/plugin`, `@nx/jest/plugin`.
- `node -v`: v24.10.0.

## Notes
- Plan said `.eslintrc (flat config)` — used standard `eslint.config.mjs` (correct flat-config filename).
- `@nx/eslint-plugin` + `typescript-eslint` + `jsonc-eslint-parser` were transitively required; added to devDeps.

## Unresolved
- None.
