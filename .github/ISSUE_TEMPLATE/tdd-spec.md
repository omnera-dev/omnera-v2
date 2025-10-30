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
7. **On success**: Issue closed, PR auto-merged to main
8. **On failure**: Spec automatically re-queued (up to 3 retries)
9. **After 3 failures**: Marked as `failed` for human review
10. **Queue continues**: Other specs processed while this one waits/retries

**Failure Handling & Retries**:

- Specs automatically retry up to **3 times** if validation fails
- Labels show retry count: `retry:1`, `retry:2`, `retry:3`
- After max retries, spec marked as `tdd-spec:failed` (requires human intervention)
- **Queue never blocks**: Failed specs don't stop other specs from being processed

**Manual Intervention Options**:

1. **Skip automation** (if too complex):
   - Add label: `skip-automated`
   - Queue will skip this spec automatically
   - Implement manually on the branch
   - Push to trigger validation

2. **Manual retry** (after reviewing failure):
   - Change label from `failed` back to `queued`
   - Remove retry labels to reset counter
   - Queue will pick it up again

3. **Direct implementation**:
   - Checkout branch: `git checkout tdd/spec-[SPEC-ID]`
   - Implement code manually
   - Push to trigger validation

Validation runs automatically on every push to the spec branch.

---

**Note**: This issue is part of the TDD automation queue. The system will process specs one at a time in FIFO order.
