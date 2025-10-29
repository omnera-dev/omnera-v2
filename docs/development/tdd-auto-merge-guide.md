# GitHub Auto-Merge Setup for TDD Pipeline

## Overview

Auto-merge eliminates the manual review bottleneck by automatically merging PRs that pass all quality checks. With 10+ PRs daily from the aggressive TDD pipeline, this is essential for maintaining throughput.

## Prerequisites

1. **Repository admin access** (to configure settings)
2. **Branch protection rules** (to ensure quality gates)
3. **GitHub Actions permissions** (for auto-merge API calls)

## Step-by-Step Setup

### 1. Enable Auto-Merge in Repository

```bash
# Via GitHub UI:
# Settings → General → Pull Requests
# ✅ Allow auto-merge
# ✅ Allow squash merging
# ✅ Automatically delete head branches

# Via GitHub CLI:
gh api repos/:owner/:repo --method PATCH \
  --field allow_auto_merge=true \
  --field allow_squash_merge=true \
  --field delete_branch_on_merge=true
```

### 2. Configure Branch Protection Rules

```bash
# Settings → Branches → Add rule for "main"

# Required settings:
# ✅ Require a pull request before merging
# ✅ Require status checks to pass before merging
#    - test (GitHub Actions workflow)
#    - lint (ESLint check)
#    - typecheck (TypeScript check)
# ✅ Require branches to be up to date before merging
# ✅ Include administrators (optional, for safety)

# Via CLI:
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --raw-field '
  {
    "required_status_checks": {
      "strict": true,
      "contexts": ["test", "lint", "typecheck", "validate"]
    },
    "enforce_admins": false,
    "required_pull_request_reviews": {
      "required_approving_review_count": 0,
      "dismiss_stale_reviews": true
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "required_linear_history": false,
    "allow_auto_merge": true
  }'
```

### 3. Deploy Auto-Merge Workflow

The workflow `.github/workflows/tdd-auto-merge.yml` automatically enables auto-merge for TDD PRs:

```yaml
# Already created - just push to activate
git add .github/workflows/tdd-auto-merge.yml
git commit -m "feat: add auto-merge workflow for TDD PRs"
git push
```

### 4. Configure GitHub App Permissions (if needed)

If using a GitHub App token instead of GITHUB_TOKEN:

1. Go to GitHub App settings
2. Add permissions:
   - Pull requests: Write
   - Issues: Write
   - Contents: Write
   - Checks: Read
3. Generate new token with permissions

## How It Works

### Automatic Flow

1. **TDD pipeline creates PR** → Labels: `tdd-automation`, `do-not-merge`
2. **Claude fixes tests** → Commits changes
3. **Validation passes** → Labels: `ready-for-review`, `auto-merge-candidate`
4. **Auto-merge workflow triggers** → Enables auto-merge
5. **All checks pass** → GitHub automatically merges
6. **Branch deleted** → Ready for next PR

### Manual Override

To prevent auto-merge on specific PRs:

```bash
# Disable auto-merge for a PR
gh pr merge --disable-auto PR_NUMBER

# Add blocking label
gh pr edit PR_NUMBER --add-label "requires-human-review"

# Request changes (blocks auto-merge)
gh pr review PR_NUMBER --request-changes --body "Need to review this manually"
```

## Safety Configuration

### Conservative Auto-Merge Rules

For more control, add additional requirements:

```yaml
# In .github/tdd-automation-config.yml
auto_merge:
  enabled: true

  # Only auto-merge if these conditions are met
  conditions:
    max_files_changed: 10 # Don't auto-merge large PRs
    max_lines_changed: 500 # Require review for big changes
    excluded_paths:
      - '*.sql' # Never auto-merge database changes
      - '**/auth/**' # Require review for auth code
      - '**/payment/**' # Require review for payment code

    required_labels:
      - 'ready-for-review'
      - 'auto-merge-candidate'

    forbidden_labels:
      - 'requires-human-review'
      - 'security'
      - 'breaking-change'
```

### Quality Gates

Ensure these checks are required in branch protection:

1. **Test Suite**
   - `test` - All unit and E2E tests pass
   - `test-regression` - No regression

2. **Code Quality**
   - `lint` - ESLint passes
   - `typecheck` - TypeScript compiles
   - `format` - Prettier formatted

3. **Security** (optional)
   - `security-scan` - No vulnerabilities
   - `dependency-check` - No outdated deps

## Monitoring Auto-Merged PRs

### Dashboard Commands

```bash
# View auto-merge enabled PRs
gh pr list --label "auto-merge-enabled" --state open

# View recently merged TDD PRs
gh pr list --label "tdd-automation" --state merged --limit 10

# Check merge rate
gh api repos/:owner/:repo/pulls \
  --jq '[.[] | select(.labels[].name == "tdd-automation")] |
         group_by(.merged) |
         map({merged: .[0].merged, count: length})'
```

### Metrics Script

```bash
# Create monitoring script
cat > scripts/tdd-auto-merge-metrics.ts << 'EOF'
#!/usr/bin/env bun

import { Octokit } from '@octokit/rest'
import { Effect, Console } from 'effect'

const getMetrics = Effect.gen(function* () {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

  // Get merged PRs from last 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const prs = yield* Effect.promise(() =>
    octokit.pulls.list({
      owner: 'your-org',
      repo: 'omnera-v2',
      state: 'closed',
      labels: 'tdd-automation',
      since
    })
  )

  const merged = prs.data.filter(pr => pr.merged_at)
  const autoMerged = merged.filter(pr =>
    pr.labels.some(l => l.name === 'auto-merge-enabled')
  )

  yield* Console.log(`
    📊 TDD Auto-Merge Metrics (Last 24h)
    ====================================
    Total PRs Created: ${prs.data.length}
    Successfully Merged: ${merged.length}
    Auto-Merged: ${autoMerged.length}
    Manual Merge Required: ${merged.length - autoMerged.length}
    Failed/Open: ${prs.data.length - merged.length}

    Auto-Merge Rate: ${((autoMerged.length / merged.length) * 100).toFixed(1)}%
    Success Rate: ${((merged.length / prs.data.length) * 100).toFixed(1)}%
  `)
})

Effect.runPromise(getMetrics)
EOF

chmod +x scripts/tdd-auto-merge-metrics.ts
```

## Best Practices

### DO ✅

1. **Review first few auto-merges** - Ensure quality standards are met
2. **Set up notifications** - Get alerts for merged PRs
3. **Monitor failure rate** - If >20% fail, investigate
4. **Use squash merge** - Keep git history clean
5. **Regular audit** - Weekly review of auto-merged code

### DON'T ❌

1. **Auto-merge security changes** - Always human review
2. **Auto-merge breaking changes** - Require approval
3. **Skip tests** - Never bypass quality gates
4. **Ignore failures** - Investigate systematic issues
5. **Auto-merge to production** - Only for main/development branches

## Gradual Rollout Strategy

### Week 1: Conservative

- Enable auto-merge only for simple features (app/version, app/name)
- Require at least 1 human approval
- Monitor quality closely

### Week 2: Moderate

- Expand to API endpoints
- Remove approval requirement for green tests
- Keep security features excluded

### Week 3: Aggressive

- Enable for all features except auth/payment
- Full automation with quality gates
- Human review by exception only

## Troubleshooting

### Auto-Merge Not Working

```bash
# Check if enabled on repo
gh api repos/:owner/:repo --jq '.allow_auto_merge'

# Check branch protection
gh api repos/:owner/:repo/branches/main/protection

# Check PR status
gh pr checks PR_NUMBER

# View workflow logs
gh run view --log
```

### Common Issues

1. **"Auto-merge not available"**
   - Enable in repository settings
   - Check branch protection rules

2. **"Checks never complete"**
   - Review required status checks
   - Ensure workflows are running

3. **"Merge conflicts"**
   - Enable "update branch" in PR
   - Or rebase automatically in workflow

4. **"PR stuck in queue"**
   - Check concurrency settings
   - May need manual intervention

## Emergency Stop

If auto-merge causes issues:

```bash
# Disable immediately
gh api repos/:owner/:repo --method PATCH \
  --field allow_auto_merge=false

# Close all open PRs
gh pr list --label "auto-merge-enabled" --json number \
  --jq '.[].number' | xargs -I {} gh pr close {}

# Revert last N auto-merged PRs if needed
git revert HEAD~N..HEAD
git push
```

## Success Metrics

Track these KPIs:

- **Auto-merge rate**: >80% (high quality)
- **Time to merge**: <30 min (fast delivery)
- **Rollback rate**: <5% (stable code)
- **Tests per day**: 50+ (high throughput)
- **Human intervention**: <20% (true automation)

With auto-merge properly configured, your TDD pipeline becomes truly autonomous, processing 50+ tests daily without human intervention!
