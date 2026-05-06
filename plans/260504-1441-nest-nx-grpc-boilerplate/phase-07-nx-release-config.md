# Phase 07 — nx release Config (Independent + Conventional)

## nx.json release block
```json
"release": {
  "projects": ["packages/apps/*", "packages/libs/*"],
  "projectsRelationship": "independent",
  "releaseTagPattern": "{projectName}@{version}",
  "version": {
    "conventionalCommits": true,
    "generatorOptions": {
      "currentVersionResolver": "git-tag",
      "fallbackCurrentVersionResolver": "disk",
      "updateDependents": "auto"
    }
  },
  "changelog": {
    "projectChangelogs": { "renderOptions": { "authors": false } },
    "workspaceChangelog": false
  },
  "git": { "commit": true, "tag": true, "commitMessage": "chore(release): publish {version}" }
}
```

## Branch Strategy
- `main` — stable: `pnpm nx release` (conventional commits drive bump).
- `staging` — pre-release: `pnpm nx release --specifier=prerelease --preid=rc`.

`updateDependents: auto` → bumping `proto` triggers consumer service bumps automatically.

## Per-Project package.json
- Set initial `"version": "0.0.0"` for `proto`, `nest-core`, `service-a`, `service-b`.
- Add `"private": true` on services (no npm publish — Docker is the artifact).
- `proto` + `nest-core` libs stay private too unless cross-repo consumers exist.

## Tag → Docker tag mapping
CI reads tags created by `nx release` → derives Docker tag `service-a:1.2.0-rc.1`.
Helper script `scripts/extract-release-tags.sh` (bash) reads `git tag --points-at HEAD` → emits `SERVICE=service-a TAG=1.2.0-rc.1` lines.

## Validation
- Local dry-run: `pnpm nx release --dry-run --specifier=prerelease --preid=rc`
- Verify only changed projects get version bumps via `nx affected`.

## Risks
- `updateDependents: auto` w/ prerelease: ensure consumer bump reuses `rc` preid.
- First release needs `--first-release` flag; document in README.
