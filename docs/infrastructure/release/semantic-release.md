# Semantic Release - Automated Version Management

## Overview

**Version**: 24.2.0
**Purpose**: Fully automated version management, changelog generation, and npm package publishing based on conventional commits

Semantic-release eliminates manual version bumping, changelog writing, and release creation by analyzing commit messages to determine the next version number and automating the entire release process.

## What Semantic Release Provides

1. **Automated Versioning** - Determines next version (major.minor.patch) from commit messages
2. **Changelog Generation** - Auto-generates CHANGELOG.md from commit history
3. **npm Publishing** - Publishes package "omnera" to npm registry automatically
4. **GitHub Releases** - Creates GitHub releases with release notes
5. **License Date Updates** - Custom script updates BSL 1.1 dates in LICENSE.md
6. **Git Commits** - Commits version bumps and changelog back to repository
7. **Version Validation** - Ensures semantic versioning (semver) compliance

## Configuration

- **Configuration File**: `.releaserc.json`
- **Trigger**: Push to `main` branch (via GitHub Actions workflow)
- **Package Name**: "omnera" (published to npm)

## Semantic Versioning Rules

Semantic-release analyzes commit messages following the Conventional Commits format to determine version bumps:

| Commit Type | Example | Version Change | Example Version |
|-------------|---------|----------------|-----------------|
| `fix:` | `fix(api): resolve timeout issue` | Patch (0.0.X) | 0.1.0 → 0.1.1 |
| `feat:` | `feat(auth): add OAuth support` | Minor (0.X.0) | 0.1.0 → 0.2.0 |
| `feat!:` or `BREAKING CHANGE:` | `feat!: redesign API structure` | Major (X.0.0) | 0.1.0 → 1.0.0 |
| `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`, `ci:` | `docs: update README` | None | 0.1.0 → 0.1.0 |

## Conventional Commits Format

All commits to `main` branch MUST follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Commit Types

- `feat:` - New feature (triggers minor version bump)
- `fix:` - Bug fix (triggers patch version bump)
- `docs:` - Documentation changes (no version bump)
- `style:` - Code style changes (formatting, no logic change, no version bump)
- `refactor:` - Code refactoring (no new features or bug fixes, no version bump)
- `perf:` - Performance improvements (no version bump)
- `test:` - Adding or updating tests (no version bump)
- `chore:` - Maintenance tasks, dependencies (no version bump)
- `ci:` - CI/CD configuration changes (no version bump)

### Breaking Changes

- Add `!` after type: `feat!:` or `fix!:`
- OR include `BREAKING CHANGE:` in footer
- Triggers major version bump (X.0.0)

### Commit Examples

```bash
# Patch release (0.1.0 → 0.1.1)
git commit -m "fix(database): resolve connection pool timeout"

# Minor release (0.1.0 → 0.2.0)
git commit -m "feat(api): add user authentication endpoint"

# Major release (0.1.0 → 1.0.0)
git commit -m "feat!: redesign API structure

BREAKING CHANGE: API endpoints now use /v2/ prefix"

# No release (documentation)
git commit -m "docs: update installation instructions"

# Multi-line with scope
git commit -m "feat(auth): implement OAuth 2.0 flow

- Add OAuth provider configuration
- Implement token refresh mechanism
- Add session management"
```

## Semantic Release Plugin Chain

The release process executes these plugins in sequence (defined in `.releaserc.json`):

### 1. @semantic-release/commit-analyzer

- Analyzes commit messages since last release
- Determines version bump type (major/minor/patch/none)
- Uses Conventional Commits specification

### 2. @semantic-release/release-notes-generator

- Generates release notes from commit messages
- Groups commits by type (Features, Bug Fixes, etc.)
- Formats notes for CHANGELOG.md and GitHub release

### 3. @semantic-release/changelog

- Updates `CHANGELOG.md` with generated release notes
- Prepends new version section to existing changelog
- Maintains chronological order (newest first)

### 4. @semantic-release/exec

- Runs custom script: `scripts/update-license-date.js`
- Updates LICENSE.md with new version and dates
- See "License Date Update Script" section below

### 5. @semantic-release/npm

- Publishes package "omnera" to npm registry
- Requires `NPM_TOKEN` secret configured in GitHub
- Updates package.json version (committed later by git plugin)

### 6. @semantic-release/git

- Commits updated files back to repository:
  - `CHANGELOG.md` (updated changelog)
  - `package.json` (bumped version)
  - `LICENSE.md` (updated dates and version)
- Commit message: `chore(release): X.X.X [skip ci]`
- `[skip ci]` prevents infinite release loop

### 7. @semantic-release/github

- Creates GitHub release with generated notes
- Tags repository with version (e.g., `v1.0.0`)
- Attaches release assets if configured

## License Date Update Script

The custom script `scripts/update-license-date.js` automatically updates LICENSE.md during each release.

### Updates Performed

1. **Version**: Updates "Licensed Work: Omnera X.X.X" with new version
2. **Copyright Year**: Updates "(c) YYYY ESSENTIAL SERVICES" with current year
3. **Change Date**: Calculates and updates BSL 1.1 Change Date (4 years from release)

### BSL 1.1 Change Date Calculation

- Business Source License 1.1 requires a "Change Date" (when code becomes open source)
- Script calculates: Current Date + 4 years
- Example: Released 2025-01-15 → Change Date: 2029-01-15
- Automatically maintained for every release

### Script Execution

```bash
# Called by semantic-release during release process
node scripts/update-license-date.js 1.2.3

# Output example:
✓ Updated LICENSE.md:
  - Version: 1.2.3
  - Copyright year: 2025
  - Change Date: 2029-01-15
```

## Release Workflow

The automated release process runs after the CI workflow completes successfully (see `docs/infrastructure/cicd/workflows.md` for details).

### Required GitHub Secrets

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `NPM_TOKEN` - Must be configured manually for npm publishing

### Workflow Permissions

```yaml
permissions:
  contents: write        # Commit version bumps and changelog
  issues: write          # Close issues referenced in commits
  pull-requests: write   # Comment on PRs
  id-token: write        # OpenID Connect token
```

## Release Process Flow

```
Developer commits to main
         ↓
Test workflow runs (tests must pass)
         ↓ (if successful)
Analyze commits for version bump
         ↓
Generate release notes
         ↓
Update CHANGELOG.md
         ↓
Update LICENSE.md (version + dates)
         ↓
Publish to npm as "omnera"
         ↓
Commit changes (with [skip ci])
         ↓
Create GitHub release with tag
         ↓
Release complete
```

## Configuration Reference (.releaserc.json)

```json
{
  "branches": ["main"],
  "repositoryUrl": "https://github.com/omnera-dev/omnera-v2",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", {
      "changelogFile": "CHANGELOG.md"
    }],
    ["@semantic-release/exec", {
      "prepareCmd": "node scripts/update-license-date.js ${nextRelease.version}"
    }],
    ["@semantic-release/npm", {
      "npmPublish": true,
      "pkgRoot": "."
    }],
    ["@semantic-release/git", {
      "assets": ["CHANGELOG.md", "package.json", "LICENSE.md"],
      "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }],
    "@semantic-release/github"
  ]
}
```

## Running Releases

### Automated Release (Recommended)

```bash
# Release happens automatically on push to main
git add .
git commit -m "feat(api): add new endpoint"
git push origin main
# Workflow runs, tests pass, version bumps, publishes to npm
```

### Manual Release (Local Testing Only)

```bash
# Test release process locally (dry-run)
bunx semantic-release --dry-run

# Manual release (not recommended - use CI/CD instead)
bunx semantic-release
# Requires NPM_TOKEN environment variable
```

## Development Workflow Integration

**IMPORTANT**: Conventional commits are REQUIRED for proper versioning.

### Before Committing

1. Determine commit type (feat, fix, docs, etc.)
2. Write descriptive subject (what changed, not how)
3. Add scope if applicable (e.g., `feat(auth):`)
4. Include breaking change marker if needed (`feat!:`)

### Commit Message Guidelines

- **Subject**: Imperative mood ("add feature" not "added feature")
- **Length**: Subject ≤ 72 characters for readability
- **Clarity**: Describe what changed and why, not how
- **Scope**: Optional but recommended (component/module name)
- **Body**: Add details for complex changes (optional)
- **Footer**: Reference issues, breaking changes (optional)

### Example Workflow

```bash
# Make code changes
vim src/api/auth.ts

# Stage changes
git add src/api/auth.ts

# Commit with conventional format
git commit -m "feat(auth): implement JWT token refresh

- Add refresh token endpoint
- Implement token rotation
- Add expiration validation"

# Push to main (triggers release if feat/fix)
git push origin main
```

## Version Bump Decision Tree

```
Does commit include breaking change?
├─ Yes → Major version bump (X.0.0)
└─ No
   ├─ Is commit type "feat:"? → Minor version bump (0.X.0)
   ├─ Is commit type "fix:"? → Patch version bump (0.0.X)
   └─ Other types → No version bump
```

## When Releases Occur

Releases happen ONLY when:

1. Commits are pushed to `main` branch
2. CI workflow completes successfully
3. At least one commit since last release uses `feat:` or `fix:` type
4. Commit message does not contain `[skip ci]`

## When Releases DO NOT Occur

No release when:

- All commits since last release are `docs:`, `chore:`, `style:`, etc.
- CI workflow fails (lint, typecheck, or unit tests)
- Commit contains `[skip ci]`
- Push is to branch other than `main`

## Files Created/Modified by Semantic Release

### Created

- `CHANGELOG.md` - Auto-generated changelog (updated on each release)

### Modified on Each Release

- `package.json` - Version number updated
- `CHANGELOG.md` - New release section prepended
- `LICENSE.md` - Version, copyright year, change date updated

### Committed by semantic-release

- Commit message: `chore(release): X.X.X [skip ci]`
- Includes updated files listed above

## Integration with Other Tools

| Tool | Integration Point | Notes |
|------|------------------|-------|
| **ESLint** | Pre-release validation | Linting must pass before release |
| **TypeScript** | Pre-release validation | Type checking must pass before release |
| **Bun Test** | Pre-release validation | Unit tests must pass before release |
| **Playwright** | Not in release workflow | E2E tests run separately in CI |
| **Prettier** | No integration | Formatting checked in separate CI workflow |
| **GitHub Actions** | Release orchestration | Workflow triggers semantic-release |
| **npm Registry** | Package publishing | "omnera" package published on release |

## Semantic Release vs Manual Releases

| Aspect | Semantic Release | Manual Releases |
|--------|------------------|-----------------|
| **Version Determination** | Automated from commits | Manual decision |
| **Changelog** | Auto-generated from commits | Manually written |
| **Publishing** | Automated to npm | Manual `npm publish` |
| **GitHub Release** | Auto-created with notes | Manually created |
| **License Updates** | Automated via script | Manual edits |
| **Git Tags** | Automatically created | Manual `git tag` |
| **Consistency** | Always follows semver | Prone to human error |
| **Speed** | Fast (seconds after push) | Slow (manual steps) |

## Troubleshooting

### No Release Created Despite feat/fix Commits

- Check commit message format (must match conventional commits)
- Verify CI workflow passed
- Check workflow logs in GitHub Actions
- Ensure `[skip ci]` not in commit message

### npm Publish Failed

- Verify `NPM_TOKEN` secret is configured in repository settings
- Check npm token has publish permissions
- Ensure package name "omnera" is available or owned by you
- Review npm publish logs in workflow

### License Update Failed

- Verify `scripts/update-license-date.js` exists
- Check LICENSE.md format matches expected patterns
- Review workflow logs for script errors

### Workflow Skipped

- Check if commit message contains `[skip ci]`
- Verify workflow file exists at `.github/workflows/release.yml`
- Ensure push was to `main` branch

### Version Conflict

- semantic-release manages versions automatically
- DO NOT manually edit version in package.json
- Let semantic-release determine and set version

## Best Practices

1. **Always use conventional commits** - Required for proper versioning
2. **Never skip CI on manual commits** - Only semantic-release should use `[skip ci]`
3. **Test before pushing to main** - Workflow runs all tests, but catch issues early
4. **Use descriptive scopes** - Helps organize changelog (e.g., `feat(api):`, `fix(db):`)
5. **Document breaking changes** - Always explain breaking changes in commit body
6. **Let automation handle versions** - Never manually bump version in package.json
7. **Review generated changelogs** - Verify release notes accurately reflect changes
8. **Squash feature branches** - Cleaner commit history for changelog generation

## References

- semantic-release documentation: https://semantic-release.gitbook.io/
- Conventional Commits specification: https://www.conventionalcommits.org/
- Plugin documentation: https://semantic-release.gitbook.io/semantic-release/extending/plugins-list
