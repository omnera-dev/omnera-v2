---
name: TDD Spec Implementation
about: Auto-generated issue for implementing a single E2E test specification
title: '🤖 [SPEC-ID]: [Description]'
labels: 'tdd-spec:queued,tdd-automation'
assignees: ''
---

## 🤖 [SPEC-ID]: [Description]

**File**: `specs/path/to/test.spec.ts:123`
**Feature**: feature/path
**Branch**: `tdd/spec-[SPEC-ID]`

### Automated Implementation

The TDD queue system will automatically post implementation instructions as a comment on this issue with `@claude` mention. The Claude Code workflow will trigger automatically when the comment is posted.

**What happens automatically**:

1. Queue processor creates this issue and branch
2. Queue processor posts a comment with `@claude` mention and detailed instructions
3. Claude Code workflow triggers from the mention
4. Agent checks out the branch and implements the test
5. Agent commits and pushes (triggers validation workflow)
6. Validation workflow runs tests and quality checks
7. On success: Issue closed, PR auto-merged to main
8. On failure: Comment posted, agent retries

**Manual intervention** (if needed):

- If automation fails, you can manually invoke Claude Code by replying: `@claude - Please implement spec [SPEC-ID] following the instructions above`
- Or manually checkout the branch: `git checkout tdd/spec-[SPEC-ID]`

Validation runs automatically on every push to the spec branch.

---

**Note**: This issue is part of the TDD automation queue. The system will process specs one at a time in FIFO order.
