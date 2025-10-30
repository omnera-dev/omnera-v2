# TDD Queue System - Setup & Limitations

## Overview

The TDD automation queue creates GitHub issues for E2E test specs and manages their implementation workflow.

## Architecture

```
┌─────────────────┐
│  Populate Queue │  Scans for .fixme() tests → Creates GitHub issues
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Process Queue  │  Creates branch → Comments with @claude mention
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validation     │  Runs on push to branch → Comments results on issue
└─────────────────┘
```

## GitHub Actions Limitations

### PR Creation Restriction

**Issue**: GitHub Actions cannot create pull requests using the default `GITHUB_TOKEN`.

**Why**: GitHub restricts this to prevent workflow recursion loops where workflows trigger other workflows infinitely.

**Official Docs**: https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow

### Current Solution

The TDD queue system works **without pull requests**:

1. **Processor** creates a branch (e.g., `tdd/spec-APP-VERSION-001`)
2. **Claude Code** implements on the branch
3. **Validation** runs automatically on push to the branch
4. **Results** are commented on the GitHub issue

### Alternative Solutions (Not Implemented)

If you need PR-based workflows, you have these options:

#### Option 1: Personal Access Token (PAT)

Create a GitHub PAT with `repo` scope and add it as a repository secret:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with `repo` scope
3. Add as repository secret named `TDD_PAT`
4. Update workflow to use it:

```yaml
env:
  GH_TOKEN: ${{ secrets.TDD_PAT }} # Instead of github.token
```

**Pros**: Full PR creation capability
**Cons**: Requires manual PAT management, security risk if token leaks

#### Option 2: GitHub App

Create a GitHub App with PR permissions:

1. Create GitHub App with `pull_requests: write` permission
2. Install app on repository
3. Use app token in workflow

**Pros**: Better security than PAT, fine-grained permissions
**Cons**: Complex setup, overkill for this use case

#### Option 3: Manual PR Creation

Let Claude Code or developers create PRs manually:

```bash
# After implementing spec
git push
gh pr create --title "fix: implement APP-VERSION-001" --body "Closes #123"
```

**Pros**: Simple, no token management
**Cons**: Not fully automated

## Current Workflow

### For Repository Maintainers

The queue runs automatically every 15 minutes. No action needed.

### Optional: Manual PR Creation

While the system works branch-based by default, you can **optionally create PRs manually** for better code review:

```bash
# After implementing spec on branch
git checkout tdd/spec-APP-VERSION-001
# ... implement and commit ...
gh pr create --title "fix: implement APP-VERSION-001" --body "Closes #123"
```

**Benefits**:

- ✅ **Auto-merge enabled**: Validation workflow automatically enables squash merge when tests pass
- ✅ **Code review**: Reviewers can comment on specific lines
- ✅ **GitHub UI**: View changes in familiar PR interface

**Note**: PRs are purely optional - the validation workflow works with or without them.

### For Claude Code

When mentioned in an issue:

1. **Checkout branch**:

   ```bash
   git checkout tdd/spec-APP-VERSION-001
   ```

2. **Implement the spec** (remove `.fixme()`, add code)

3. **Push changes**:

   ```bash
   bun run license
   git add -A
   git commit -m "fix: implement APP-VERSION-001"
   git push
   ```

4. **Validation runs automatically** - results commented on issue

5. **If tests pass**: Issue marked as completed

6. **If tests fail**: Issue remains in-progress, retry with fixes

### Manual Trigger

To manually process the queue:

```bash
# Via GitHub UI
Go to Actions → TDD Queue - Processor → Run workflow

# Via CLI
gh workflow run tdd-queue-processor.yml
```

## Issue Labels

The system uses these labels (auto-created by `setup:labels` script):

- `tdd-spec:queued` (🟡 Orange) - Spec queued for implementation
- `tdd-spec:in-progress` (🔵 Blue) - Spec currently being implemented
- `tdd-spec:completed` (🟢 Green) - Spec implementation completed
- `tdd-spec:failed` (🔴 Red) - Spec implementation failed validation
- `tdd-automation` (⚫ Gray) - Automated issue by TDD pipeline
- `skip-automated` (⚪ Light gray) - Skip TDD automation

## Configuration

Settings in `.github/tdd-automation-config.yml`:

```yaml
processor:
  interval: '*/15 * * * *' # Every 15 minutes
  max_concurrent: 1 # Process one spec at a time
  auto_merge: true # (Not used without PRs)

validation:
  timeout: 120000 # 2 minutes
  retry_on_failure: false # Keep in-progress for manual retry
```

## Monitoring

### Check Queue Status

```bash
bun run scripts/tdd-automation/queue-manager.ts status
```

### View Queue Issues

```bash
# Queued specs
gh issue list --label "tdd-spec:queued"

# In-progress specs
gh issue list --label "tdd-spec:in-progress"

# Completed specs
gh issue list --label "tdd-spec:completed" --state closed
```

### View Progress

```bash
bun run scripts/tdd-automation/track-progress.ts
```

## Troubleshooting

### Spec Stuck in "queued"

**Symptom**: Issue has `tdd-spec:queued` label but no branch created

**Solution**: Manually trigger processor workflow or wait for next scheduled run

### Spec Stuck in "in-progress"

**Symptom**: Issue has `tdd-spec:in-progress` label but no activity

**Possible causes**:

1. Claude Code hasn't implemented yet (expected)
2. Validation failed (check workflow logs)
3. Branch deleted accidentally

**Solution**: Check issue comments for status, or restart implementation

### Validation Not Running

**Symptom**: Pushed to branch but no validation workflow triggered

**Check**:

1. Branch name matches pattern `tdd/spec-*`
2. Workflow enabled in Actions tab
3. Check workflow logs for errors

### Issue Not Auto-Closing

**Symptom**: Tests pass but issue remains open

**Explanation**: Without PRs, issues need manual closure. The validation workflow comments success but doesn't auto-close.

**Solution**: Close issue manually or update validation workflow to close on success

## Performance

- **Queue scan**: ~3-5 seconds (500 specs)
- **Processor**: ~10-15 seconds per spec
- **Validation**: ~2 minutes (E2E tests + quality checks)
- **Total cycle time**: 15 minutes (queue interval) + 2 minutes (validation) = ~17 minutes per spec

## Limits

- **Max queue size**: Unlimited (GitHub issues API)
- **Concurrent processing**: 1 spec at a time (configurable)
- **Rate limiting**: GitHub API has 5000 requests/hour limit

## Security

The processor workflow has minimal permissions:

```yaml
permissions:
  contents: write # For branch creation
  issues: write # For issue comments
  pull-requests: write # (Not used without PRs)
```

**Note**: `pull-requests: write` doesn't allow PR creation from workflows - this is intentional GitHub security.

## Future Improvements

1. **Auto-close issues** when validation passes (update validation workflow)
2. **Batch processing** for faster queue throughput
3. **Parallel validation** for independent specs
4. **Progress dashboard** in GitHub Pages
5. **Slack/Discord notifications** for completed specs

---

_Last Updated: 2025-01-30_
