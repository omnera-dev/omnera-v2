# Architecture Decision Records (ADRs)

## Overview

This directory contains Architecture Decision Records (ADRs) - documents that capture important architectural decisions made in the Omnera project, along with their context and consequences.

## Why ADRs?

- **Historical Context**: Understand why decisions were made
- **Onboarding**: Help new team members understand the architecture
- **Review Triggers**: Set dates to revisit decisions
- **Avoid Repetition**: Prevent re-litigating past decisions

## ADR Format

Each ADR follows this structure:

1. **Status**: Proposed, Accepted, Deprecated, Superseded
2. **Context**: What prompted this decision?
3. **Decision**: What did we decide?
4. **Rationale**: Why did we make this choice?
5. **Consequences**: What are the trade-offs?
6. **Alternatives**: What else did we consider?

## Current ADRs

| ADR                                      | Title                                           | Status   | Date       | Review Date |
| ---------------------------------------- | ----------------------------------------------- | -------- | ---------- | ----------- |
| [001](./001-validation-library-split.md) | Validation Library Split (Effect Schema vs Zod) | Accepted | 2025-01-29 | 2025-07-01  |
| [002](./002-domain-feature-isolation.md) | Domain Feature Isolation Pattern                | Accepted | 2025-01-29 | 2025-04-01  |

## Planned ADRs

These decisions should be documented in future ADRs:

1. **Client vs Server Date Libraries** - Why date-fns for client and Effect.DateTime for server?
2. **Singular vs Plural Directory Names** - Why `table/` not `tables/`?
3. **Effect Schema in Domain Layer** - Why allow this external dependency in the "pure" domain?
4. **Layer-Based vs Feature-Based Architecture** - Why combine both patterns?
5. **Root Aggregation Pattern** - Why have `tables.ts`, `pages.ts` files that re-export?
6. **Strict Array Immutability** - Why enforce at ERROR level with ESLint?
7. **Phase-Based Application Organization** - Why organize application layer by phases?

## Creating New ADRs

To create a new ADR:

1. Copy the template: `cp 001-validation-library-split.md XXX-your-decision.md`
2. Replace XXX with the next number (e.g., 003)
3. Fill in all sections
4. Update this README with the new ADR
5. Set a review date (typically 3-6 months)

## Review Process

ADRs should be reviewed on their review dates to assess:

- Is the decision still valid?
- Have circumstances changed?
- Should the decision be revised or superseded?
- What have we learned from implementing it?

## References

- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) by Michael Nygard
- [Architecture Decision Records](https://adr.github.io/)
- [ADR Tools](https://github.com/npryce/adr-tools)
