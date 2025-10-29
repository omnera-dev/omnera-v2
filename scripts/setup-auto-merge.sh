#!/bin/bash
# Setup Auto-Merge for TDD Pipeline
# Run this script to configure GitHub auto-merge for maximum automation

set -e

echo "🔄 TDD Pipeline Auto-Merge Setup"
echo "================================="
echo ""

# Get repository details
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
OWNER=$(echo $REPO | cut -d'/' -f1)
REPO_NAME=$(echo $REPO | cut -d'/' -f2)

echo "📦 Repository: $REPO"
echo ""

# Step 1: Enable auto-merge on repository
echo "1️⃣ Enabling auto-merge on repository..."
gh api repos/$REPO --method PATCH \
  --field allow_auto_merge=true \
  --field allow_squash_merge=true \
  --field delete_branch_on_merge=true \
  --field allow_merge_commit=false \
  --field allow_rebase_merge=false \
  > /dev/null 2>&1 && echo "   ✅ Auto-merge enabled" || echo "   ⚠️  Failed (may need admin rights)"

# Step 2: Configure branch protection
echo ""
echo "2️⃣ Configuring branch protection for 'main'..."

# Create the protection rules
PROTECTION_RULES='{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "test",
      "validate",
      "ESLint",
      "TypeScript",
      "Unit Tests",
      "E2E Regression Tests"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": false,
  "allow_auto_merge": true,
  "block_creations": false,
  "required_conversation_resolution": false,
  "lock_branch": false,
  "allow_fork_syncing": false
}'

gh api repos/$REPO/branches/main/protection \
  --method PUT \
  --input - <<< "$PROTECTION_RULES" \
  > /dev/null 2>&1 && echo "   ✅ Branch protection configured" || echo "   ⚠️  Failed (may already exist)"

# Step 3: Create label for auto-merge
echo ""
echo "3️⃣ Creating labels for auto-merge..."
gh label create "auto-merge-candidate" \
  --description "PR is eligible for auto-merge" \
  --color "0E8A16" \
  --force > /dev/null 2>&1 && echo "   ✅ Label 'auto-merge-candidate' created"

gh label create "auto-merge-enabled" \
  --description "Auto-merge has been enabled for this PR" \
  --color "5319E7" \
  --force > /dev/null 2>&1 && echo "   ✅ Label 'auto-merge-enabled' created"

gh label create "requires-human-review" \
  --description "This PR must be reviewed by a human" \
  --color "B60205" \
  --force > /dev/null 2>&1 && echo "   ✅ Label 'requires-human-review' created"

# Step 4: Check workflow files
echo ""
echo "4️⃣ Checking workflow files..."
if [ -f ".github/workflows/tdd-auto-merge.yml" ]; then
  echo "   ✅ Auto-merge workflow exists"
else
  echo "   ❌ Auto-merge workflow missing - please commit and push the workflow files"
fi

# Step 5: Display current settings
echo ""
echo "5️⃣ Current Configuration:"
echo ""
gh api repos/$REPO --jq '{
  "Auto-merge enabled": .allow_auto_merge,
  "Squash merge": .allow_squash_merge,
  "Delete branches": .delete_branch_on_merge,
  "Default branch": .default_branch
}' | jq .

# Step 6: Test auto-merge capability
echo ""
echo "6️⃣ Testing auto-merge capability..."

# Get current user
CURRENT_USER=$(gh api user --jq .login)
echo "   Current user: $CURRENT_USER"

# Check permissions
PERMISSION=$(gh api repos/$REPO/collaborators/$CURRENT_USER/permission --jq .permission)
echo "   Permission level: $PERMISSION"

if [[ "$PERMISSION" == "admin" ]] || [[ "$PERMISSION" == "maintain" ]] || [[ "$PERMISSION" == "write" ]]; then
  echo "   ✅ You have sufficient permissions for auto-merge"
else
  echo "   ⚠️  You may need higher permissions to enable auto-merge on PRs"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "1. Commit and push the auto-merge workflow:"
echo "   git add .github/workflows/tdd-auto-merge.yml"
echo "   git commit -m 'feat: enable auto-merge for TDD PRs'"
echo "   git push"
echo ""
echo "2. The TDD pipeline will now automatically:"
echo "   • Create PRs for test fixes"
echo "   • Enable auto-merge when tests pass"
echo "   • Merge without human intervention"
echo ""
echo "3. Monitor auto-merged PRs:"
echo "   gh pr list --label 'auto-merge-enabled' --state merged"
echo ""
echo "⚠️  Important:"
echo "• PRs with 'requires-human-review' label will NOT auto-merge"
echo "• Failed checks will prevent auto-merge"
echo "• You can always disable auto-merge on specific PRs"
echo ""
echo "🚀 Your TDD pipeline is now fully automated!"