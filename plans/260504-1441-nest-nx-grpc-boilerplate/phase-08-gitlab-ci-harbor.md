# Phase 08 — GitLab CI + Harbor

## .gitlab-ci.yml Outline
```yaml
image: node:24-alpine

variables:
  PNPM_HOME: "$CI_PROJECT_DIR/.pnpm-store"
  NX_BRANCH: $CI_COMMIT_REF_NAME
  HARBOR_REGISTRY: harbor.example.com
  HARBOR_PROJECT: my-org

stages: [setup, verify, build, release, docker]

cache:
  key: pnpm-$CI_COMMIT_REF_SLUG
  paths: [.pnpm-store, .nx/cache]

before_script:
  - corepack enable && corepack prepare pnpm@10 --activate
  - pnpm config set store-dir .pnpm-store
  - pnpm install --frozen-lockfile

setup:
  stage: setup
  script: [pnpm nx run proto:generate]
  artifacts: { paths: [packages/libs/proto/src/generated], expire_in: 1h }

lint:
  stage: verify
  script: [pnpm nx affected -t lint typecheck lint-proto]

test:
  stage: verify
  script: [pnpm nx affected -t test]

build:
  stage: build
  script: [pnpm nx affected -t build]
  artifacts: { paths: [dist], expire_in: 1h }

release:
  stage: release
  rules:
    - if: $CI_COMMIT_BRANCH == "staging"
      variables: { RELEASE_ARGS: "--specifier=prerelease --preid=rc" }
    - if: $CI_COMMIT_BRANCH == "main"
      variables: { RELEASE_ARGS: "" }
    - when: never
  before_script:
    - !reference [default, before_script]
    - git remote set-url origin "https://oauth2:$GITLAB_RELEASE_TOKEN@$CI_SERVER_HOST/$CI_PROJECT_PATH.git"
    - git config user.email "ci@example.com" && git config user.name "ci"
  script:
    - pnpm nx release $RELEASE_ARGS --yes
    - bash scripts/extract-release-tags.sh > released.env
  artifacts: { reports: { dotenv: released.env } }

docker:
  stage: docker
  image: gcr.io/kaniko-project/executor:debug
  needs: [release]
  rules:
    - if: $CI_COMMIT_BRANCH == "staging" || $CI_COMMIT_BRANCH == "main"
  script:
    - |
      while IFS= read -r line; do
        eval "$line"
        /kaniko/executor \
          --context "$CI_PROJECT_DIR" \
          --dockerfile "packages/apps/$SERVICE/Dockerfile" \
          --destination "$HARBOR_REGISTRY/$HARBOR_PROJECT/$SERVICE:$TAG" \
          --build-arg SERVICE=$SERVICE
      done < released.env
```

## Required CI Variables
| Var | Source | Notes |
|---|---|---|
| `GITLAB_RELEASE_TOKEN` | masked, protected | push tags + commits back |
| `HARBOR_USERNAME` | Harbor robot | `robot$my-org+ci` |
| `HARBOR_PASSWORD` | Harbor robot | masked |
| `HARBOR_REGISTRY` | plain | `harbor.example.com` |

Kaniko auth: mount `/kaniko/.docker/config.json` from `$HARBOR_USERNAME`/`$HARBOR_PASSWORD` via `before_script`.

## extract-release-tags.sh
```bash
#!/usr/bin/env bash
set -euo pipefail
git tag --points-at HEAD | while read -r tag; do
  svc="${tag%@*}"; ver="${tag#*@}"
  [[ "$svc" == service-* ]] && echo "SERVICE=$svc TAG=$ver"
done
```

## Validation
- Push to `staging` → tag `service-a@1.0.0-rc.1` created → Harbor image exists.
- Push to `main` → stable tag + image.
- Affected-only: untouched service skipped in build/release/docker.

## Risks
- `nx release` push needs token w/ tag-create perm on protected branches.
- Kaniko + monorepo context size — ensure `.dockerignore` trims aggressively.
- Concurrent staging pushes can race on tags — set `interruptible: true` + lock job.
