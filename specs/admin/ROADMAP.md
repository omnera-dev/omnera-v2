# Admin UI Roadmap

> **Last Generated**: 2025-10-29
> **Back to**: [Main Roadmap](../../ROADMAP.md)

## Admin UI Specifications (24 total)

### Status Legend

- ✅ **DONE**: Test implemented and passing
- 🚧 **WIP**: Test exists but marked with .fixme()
- ⏳ **TODO**: No test file exists

### All Specifications

| Status | ID                    | Specification                                                                                          | Source File                                | Test File                                     |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------ | --------------------------------------------- |
| 🚧     | ADMIN-CONNECTIONS-001 | **Given** user is authenticated in a workspace, **When** user navigates to connections page, \*\*Th... | `specs/admin/connections/connections.json` | `specs/admin/connections/connections.spec.ts` |
| 🚧     | ADMIN-CONNECTIONS-002 | **Given** connection exists with valid OAuth credentials but is not connected, **When** user init...   | `specs/admin/connections/connections.json` | `specs/admin/connections/connections.spec.ts` |
| 🚧     | ADMIN-CONNECTIONS-003 | **Given** connection is in 'connected' status with active tokens, **When** user clicks 'Disconnec...   | `specs/admin/connections/connections.json` | `specs/admin/connections/connections.spec.ts` |
| 🚧     | ADMIN-CONNECTIONS-004 | **Given** connection is configured and shareable feature is enabled, **When** user clicks 'Copy L...   | `specs/admin/connections/connections.json` | `specs/admin/connections/connections.spec.ts` |
| 🚧     | ADMIN-TABLES-001      | **Given** application is running, **When** user navigates to admin tables page, **Then** page sho...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-002      | **Given** application is running with configured tables, **When** user lists tables, **Then** all...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-003      | **Given** application is running with a table containing records, **When** user navigates to tabl...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-004      | **Given** application is running with a table containing searchable records, **When** user search...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-005      | **Given** application is running with a table containing a record, **When** user opens a table re...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-006      | **Given** application is running with a table, **When** user creates a new record, **Then** recor...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-007      | **Given** user is working with required fields, **When** user creates a table record with all req...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-008      | **Given** application is running with an existing record, **When** user updates the record, \*\*The... | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-009      | **Given** application is running with an existing record, **When** user deletes the record, \*\*The... | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-010      | **Given** user is working with missing required fields, **When** user attempts to create a record...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-011      | **Given** application is running, **When** user creates a record via POST request, **Then** recor...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-012      | **Given** user is working with missing required fields, **When** user attempts to create multiple...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-013      | **Given** application is running, **When** user creates multiple records via POST request, \*\*Then... | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-014      | **Given** application is running with an existing record, **When** user reads a record via GET re...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-015      | **Given** application is running with records, **When** user lists records via GET request, \*\*The... | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-016      | **Given** application is running with an existing record, **When** user updates a record via PATC...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-017      | **Given** application is running with multiple records, **When** user updates multiple records vi...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-018      | **Given** application is running with an existing record, **When** user deletes a record via DELE...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| 🚧     | ADMIN-TABLES-019      | **Given** application is running with multiple records, **When** user deletes multiple records vi...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |
| ⏳     | ADMIN-TABLES-020      | **Given** user is on the admin tables page with a complete table configuration, **When** user per...   | `specs/admin/tables/tables.json`           | `specs/admin/tables/tables.spec.ts`           |

### Summary

| Total | ✅ DONE | 🚧 WIP | ⏳ TODO |
| ----- | ------- | ------ | ------- |
| 24    | 0       | 23     | 1       |
