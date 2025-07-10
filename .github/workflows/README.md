# GitHub Actions Workflows

This directory contains GitHub Actions workflows that replicate the functionality of the GitLab CI pipeline. The workflows are designed for a NestJS microservices monorepo using Nx and pnpm.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main`, `staging`, or `beta` branches
- Pull requests targeting `main`, `staging`, or `beta` branches

**Purpose:**
- Runs linting, testing, and building for affected projects
- Uses Nx affected commands to only run tasks for changed projects
- Provides fast feedback for code changes

**Jobs:**
- **ci**: Runs lint, test, and build tasks using Nx affected commands

### 2. Release Workflow (`release.yml`)

**Triggers:**
- Push to `main`, `staging`, or `beta` branches (not on PRs)

**Purpose:**
- Handles versioning and tagging using Nx release
- Creates different release types based on the target branch:
  - `main`: Production releases (no pre-release identifier)
  - `staging`: Alpha pre-releases (`alpha` pre-release identifier)
  - `beta`: Beta pre-releases (`beta` pre-release identifier)

**Features:**
- Uses conventional commits for automatic version bumping
- Independent versioning for each microservice
- Automatically pushes tags and changelog updates
- Global concurrency lock to prevent conflicting releases

### 3. Docker Build Workflow (`docker-build.yml`)

**Triggers:**
- Push of tags matching pattern `*@v*` (e.g., `service-user@v1.0.0`)

**Purpose:**
- Builds and pushes Docker images to GitHub Container Registry (ghcr.io)
- Extracts service name and version from git tags
- Uses the existing Dockerfile with build arguments

**Features:**
- Automatically extracts service name and version from tags
- Builds multi-architecture images using Docker Buildx
- Uses GitHub Actions cache for faster builds
- Generates software attestations for security compliance
- Tags images with both version and `latest` (for main branch)

## Configuration

### Environment Variables

All workflows use these consistent environment variables:
- `NODE_VERSION: '23'` - Node.js version (matches your package.json engines)
- `PNPM_VERSION: '10.11.0'` - pnpm version (matches your packageManager)

### Registry

Docker images are pushed to GitHub Container Registry (`ghcr.io`) by default. Images are accessible at:
```
ghcr.io/<username>/<service-name>:<version>
```

### Permissions

The workflows require these GitHub repository settings:
- **Actions**: Read and write permissions
- **Packages**: Write permissions (for Docker images)
- **Contents**: Write permissions (for releasing)

## Migration from GitLab CI

This setup replaces your GitLab CI with equivalent functionality:

| GitLab CI Job | GitHub Actions Workflow | Notes |
|---------------|-------------------------|-------|
| `release` | `release.yml` | Same branch-based release logic |
| `docker-build` | `docker-build.yml` | Uses GitHub Container Registry instead of GitLab |
| Test jobs | `ci.yml` | Added comprehensive testing with Nx affected |

### Key Differences

1. **Container Registry**: Uses GitHub Container Registry (`ghcr.io`) instead of GitLab Container Registry
2. **Authentication**: Uses `GITHUB_TOKEN` instead of GitLab tokens
3. **Caching**: Uses GitHub Actions cache instead of GitLab cache
4. **Concurrency**: Uses GitHub Actions concurrency groups instead of GitLab resource groups

### Secrets Required

No additional secrets are required beyond the default `GITHUB_TOKEN` that GitHub provides automatically.

## Nx Release Configuration

The workflows work with your existing Nx release configuration:
- Uses conventional commits for version calculation
- Independent versioning for each service
- Tag pattern: `{projectName}@v{version}`
- Projects pattern: `@nest-mono/service-*`

## Usage

1. **Development**: Push to feature branches triggers CI for affected projects
2. **Staging**: Push to `staging` branch creates alpha pre-releases
3. **Beta Testing**: Push to `beta` branch creates beta pre-releases  
4. **Production**: Push to `main` branch creates production releases
5. **Docker Images**: Each release automatically triggers Docker image builds and pushes 