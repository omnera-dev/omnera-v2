# Omnera Development Roadmap

> **Status Tracking**: This document serves as the single source of truth for Omnera's development progress, showing the implementation journey from current minimal schema to full platform vision.

## Overview

### Current State (v0.0.1)

- **Schema File**: `schemas/0.0.1/app.schema.json`
- **Properties**: 3 (name, version, description)
- **Lines of Code**: ~64 lines
- **Capabilities**: Application metadata only

### Vision State (Target)

- **Schema File**: `docs/specifications/specs.schema.json`
- **Properties**: 8 (name, description, icon, color, appVersion, schemaVersion, tables, pages, automations, connections)
- **Lines of Code**: ~1,256 lines
- **Capabilities**: Full configuration-driven platform

### Implementation Gap

**~95%** of features not yet implemented. This roadmap breaks down the journey into 7 phases spanning from v0.0.1 to v1.0.0.

---

## Quick Status Overview

| Phase   | Version | Status             | Features                                     | Target Date |
| ------- | ------- | ------------------ | -------------------------------------------- | ----------- |
| Phase 0 | v0.0.1  | ✅ **DONE**        | Basic metadata                               | Completed   |
| Phase 1 | v0.1.0  | ⏳ **NOT STARTED** | Tables (basic fields) + CRUD API             | Q2 2025     |
| Phase 2 | v0.2.0  | ⏳ **NOT STARTED** | Advanced fields (relationships, attachments) | Q2 2025     |
| Phase 3 | v0.3.0  | ⏳ **NOT STARTED** | Pages (4 types)                              | Q3 2025     |
| Phase 4 | v0.4.0  | ⏳ **NOT STARTED** | Automations (workflows)                      | Q3 2025     |
| Phase 5 | v0.5.0  | ⏳ **NOT STARTED** | Connections (integrations)                   | Q4 2025     |
| Phase 6 | v1.0.0  | ⏳ **NOT STARTED** | UI metadata + polish                         | Q4 2025     |

**Legend**: ✅ Done | 🚧 In Progress | ⏳ Not Started

---

## Feature Comparison Matrix

| Feature                      | Current (v0.0.1) | Vision (v1.0.0) | Status     |
| ---------------------------- | ---------------- | --------------- | ---------- |
| **Application Metadata**     |                  |                 |            |
| ↳ Name                       | ✅               | ✅              | ✅ DONE    |
| ↳ Version                    | ✅               | ✅              | ✅ DONE    |
| ↳ Description                | ✅               | ✅              | ✅ DONE    |
| ↳ Icon                       | ❌               | ✅              | ⏳ Phase 6 |
| ↳ Color Theme                | ❌               | ✅              | ⏳ Phase 6 |
| ↳ Schema Version             | ❌               | ✅              | ⏳ Phase 6 |
| **Tables**                   |                  |                 |            |
| ↳ Table Definition           | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Text Fields (5 types)      | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Number Fields (4 types)    | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Date Fields (3 types)      | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Checkbox Field             | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Single Select Field        | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Multi Select Field         | ❌               | ✅              | ⏳ Phase 2 |
| ↳ Relationship Field         | ❌               | ✅              | ⏳ Phase 2 |
| ↳ Single Attachment Field    | ❌               | ✅              | ⏳ Phase 2 |
| ↳ Multiple Attachments Field | ❌               | ✅              | ⏳ Phase 2 |
| **API Routes**               |                  |                 |            |
| ↳ CRUD Endpoints             | ❌               | ✅              | ⏳ Phase 1 |
| ↳ File Upload API            | ❌               | ✅              | ⏳ Phase 2 |
| ↳ Pagination                 | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Filtering                  | ❌               | ✅              | ⏳ Phase 1 |
| ↳ Sorting                    | ❌               | ✅              | ⏳ Phase 1 |
| **Pages**                    |                  |                 |            |
| ↳ Custom HTML Page           | ❌               | ✅              | ⏳ Phase 3 |
| ↳ Form Page                  | ❌               | ✅              | ⏳ Phase 3 |
| ↳ Table View Page            | ❌               | ✅              | ⏳ Phase 3 |
| ↳ Detail View Page           | ❌               | ✅              | ⏳ Phase 3 |
| **Automations**              |                  |                 |            |
| ↳ Triggers                   | ❌               | ✅              | ⏳ Phase 4 |
| ↳ Actions                    | ❌               | ✅              | ⏳ Phase 4 |
| ↳ Conditions                 | ❌               | ✅              | ⏳ Phase 4 |
| ↳ Template Variables         | ❌               | ✅              | ⏳ Phase 4 |
| **Connections**              |                  |                 |            |
| ↳ OAuth Providers            | ❌               | ✅              | ⏳ Phase 5 |
| ↳ Email Services             | ❌               | ✅              | ⏳ Phase 5 |
| ↳ External APIs              | ❌               | ✅              | ⏳ Phase 5 |
| ↳ Cloud Storage              | ❌               | ✅              | ⏳ Phase 5 |

---

## Detailed Phase Breakdown

### Phase 0: Foundation (v0.0.1) ✅

**Status**: ✅ **COMPLETED**

**Goal**: Establish minimal viable schema structure

**Implemented Features**:

- ✅ Application name property (npm package naming conventions)
- ✅ Application version property (SemVer 2.0.0)
- ✅ Application description property
- ✅ JSON Schema validation structure
- ✅ Basic schema infrastructure

**Schema Location**: `schemas/0.0.1/app.schema.json`

**Lines of Code**: 64 lines

---

### Phase 1: Tables Foundation (v0.1.0) ⏳

**Status**: ⏳ **NOT STARTED**

**Target Date**: Q2 2025

**Estimated Duration**: 4-6 weeks

**Goal**: Implement core table functionality with basic field types and CRUD operations

**Features to Implement**:

#### Schema Changes:

- ⏳ Add `tables` property (array)
- ⏳ Table structure: `id`, `name`, `fields`
- ⏳ Text fields: `single-line-text`, `long-text`, `phone-number`, `email`, `url`
- ⏳ Number fields: `integer`, `decimal`, `currency`, `percentage`
- ⏳ Date fields: `date`, `datetime`, `time`
- ⏳ Boolean field: `checkbox`
- ⏳ Selection field: `single-select`

#### API Implementation:

- ⏳ Convention-based routing: `/api/tables/{tableName}/records`
- ⏳ CRUD endpoints: GET (list), GET (single), POST, PATCH, DELETE
- ⏳ Query parameters: pagination (`page`, `limit`)
- ⏳ Sorting support (`sort` parameter)
- ⏳ Filtering support (`filter[field]` parameters)

#### Infrastructure:

- ⏳ Database schema generation (Drizzle ORM)
- ⏳ Effect Schema validation for table configuration
- ⏳ PostgreSQL table creation from JSON config
- ⏳ Auto-migration on schema changes
- ⏳ REST API route generation

**Technical Approach**:

1. Create `src/domain/models/app/tables.ts` with Effect Schema
2. Implement `src/application/use-cases/tables/` for business logic
3. Build `src/infrastructure/database/schema-generator.ts` for Drizzle mapping
4. Create `src/presentation/api/routes/tables.ts` for REST endpoints
5. Add comprehensive E2E tests in `tests/tables/`

**Success Criteria**:

- JSON config with tables generates working PostgreSQL schema
- CRUD API endpoints auto-generated and functional
- Basic validation working (required fields, data types)
- E2E tests covering table creation and CRUD operations

---

### Phase 2: Advanced Fields (v0.2.0) ⏳

**Status**: ⏳ **NOT STARTED**

**Target Date**: Q2 2025

**Estimated Duration**: 3-4 weeks

**Goal**: Add complex field types enabling relationships and file storage

**Features to Implement**:

#### Schema Changes:

- ⏳ Multi-select field with `options` and `maxSelections`
- ⏳ Relationship field with `relatedTable`, `relationType`, `displayField`
- ⏳ Single attachment field with storage config
- ⏳ Multiple attachments field with `maxFiles` and storage config
- ⏳ Storage configuration: `provider` (local/s3), `bucket`, `maxSize`, `allowedTypes`

#### API Implementation:

- ⏳ File upload endpoint: `POST /api/tables/{table}/records/{id}/fields/{field}/upload`
- ⏳ File download endpoint: `GET /api/tables/{table}/records/{id}/fields/{field}/download/{fileId}`
- ⏳ File delete endpoint: `DELETE /api/tables/{table}/records/{id}/fields/{field}/files/{fileId}`
- ⏳ Relationship resolution in GET requests
- ⏳ Cascade delete handling for relationships

#### Infrastructure:

- ⏳ Local file storage implementation
- ⏳ S3-compatible storage integration
- ⏳ Foreign key constraint generation
- ⏳ Join query optimization for relationships
- ⏳ File metadata storage

**Technical Approach**:

1. Extend `src/domain/models/app/tables.ts` with new field types
2. Implement `src/infrastructure/storage/` for local and S3 providers
3. Add relationship resolution in `src/application/use-cases/tables/`
4. Create file upload handlers in `src/presentation/api/routes/files.ts`
5. Add E2E tests for relationships and file uploads

**Dependencies**: Phase 1 must be completed

**Success Criteria**:

- Relationships properly establish foreign keys
- File uploads work with both local and S3 storage
- Cascade deletes prevent orphaned records
- Multi-select properly validates options

---

### Phase 3: Pages System (v0.3.0) ⏳

**Status**: ⏳ **NOT STARTED**

**Target Date**: Q3 2025

**Estimated Duration**: 5-7 weeks

**Goal**: Implement dynamic page generation from configuration

**Features to Implement**:

#### Schema Changes:

- ⏳ Add `pages` property (array with discriminated union)
- ⏳ **Custom HTML Page**: `head` elements (meta, title, script, style, link), `body` elements
- ⏳ **Form Page**: `inputs`, `action`, `table`, `successMessage`, `redirectUrl`
- ⏳ **Table View Page**: `table`, `columns`, `searchable`, `sortable`, `filterable`, `actions`
- ⏳ **Detail View Page**: `table`, `layout`, `sections`

#### API Implementation:

- ⏳ Form submission: `POST /api/pages/{pageName}/submit`
- ⏳ Dynamic routing from `path` configuration
- ⏳ SSR for all page types

#### Infrastructure:

- ⏳ React component generation from page config
- ⏳ Dynamic route registration in Hono
- ⏳ Form validation (client and server)
- ⏳ TanStack Table integration for table-view pages
- ⏳ shadcn/ui form components

**Technical Approach**:

1. Create `src/domain/models/app/pages.ts` with 4 page type schemas
2. Implement `src/application/use-cases/pages/` for page rendering logic
3. Build `src/presentation/components/pages/` for React components
4. Create dynamic route handler in `src/presentation/api/routes/pages.ts`
5. Add form submission handlers and validation
6. E2E tests for all 4 page types

**Dependencies**: Phase 1 (tables for form submission, table-view, detail-view)

**Success Criteria**:

- Custom HTML pages render with head/body config
- Form pages collect data and save to tables
- Table view pages display records with CRUD operations
- Detail view pages show single record with layout options
- All page types properly route from path configuration

---

### Phase 4: Automations (v0.4.0) ⏳

**Status**: ⏳ **NOT STARTED**

**Target Date**: Q3 2025

**Estimated Duration**: 6-8 weeks

**Goal**: Implement event-driven workflows and automation system

**Features to Implement**:

#### Schema Changes:

- ⏳ Add `automations` property (array)
- ⏳ Triggers: database events, schedules (cron), webhooks, manual
- ⏳ Actions: send email, update records, call APIs, run custom code
- ⏳ Conditions: if-then logic, field comparisons
- ⏳ Template variables with `{{variable}}` syntax

#### API Implementation:

- ⏳ Manual trigger: `POST /api/automations/{name}/trigger`
- ⏳ Status check: `GET /api/automations/{name}/status?executionId={id}`
- ⏳ Webhook endpoints: `POST /webhooks/{name}?token={token}`

#### Infrastructure:

- ⏳ Event system for database triggers
- ⏳ Cron job scheduler
- ⏳ Template variable parser and resolver
- ⏳ Email service integration (SMTP/Resend)
- ⏳ Webhook security (token validation)
- ⏳ Background job queue

**Technical Approach**:

1. Create `src/domain/models/app/automations.ts` with trigger/action schemas
2. Implement `src/application/use-cases/automations/` for workflow execution
3. Build `src/infrastructure/automation/` for triggers and actions
4. Create event emitter in `src/infrastructure/database/events.ts`
5. Integrate cron scheduler (node-cron or similar)
6. Add execution tracking and status API

**Dependencies**: Phase 1 (tables for database triggers), Phase 3 (forms for form submission triggers)

**Success Criteria**:

- Database events trigger automations
- Scheduled automations run on cron schedule
- Webhooks trigger automations securely
- Template variables properly resolve
- Email actions successfully send emails
- Execution status tracked and queryable

---

### Phase 5: Connections (v0.5.0) ⏳

**Status**: ⏳ **NOT STARTED**

**Target Date**: Q4 2025

**Estimated Duration**: 4-6 weeks

**Goal**: Enable external service integrations and OAuth

**Features to Implement**:

#### Schema Changes:

- ⏳ Add `connections` property (array)
- ⏳ OAuth providers: Google, GitHub, Microsoft, etc.
- ⏳ Email services: SMTP, Resend, SendGrid
- ⏳ Payment systems: Stripe
- ⏳ Cloud storage: S3, Google Cloud Storage
- ⏳ API connections: REST, GraphQL

#### API Implementation:

- ⏳ OAuth callback handlers: `/auth/{provider}/callback`
- ⏳ Connection testing endpoints
- ⏳ Credential encryption and storage

#### Infrastructure:

- ⏳ Better Auth integration for OAuth providers
- ⏳ Credential vault (encrypted storage)
- ⏳ Connection health checks
- ⏳ Rate limiting for external APIs
- ⏳ Retry logic with exponential backoff

**Technical Approach**:

1. Create `src/domain/models/app/connections.ts` with provider schemas
2. Implement `src/infrastructure/connections/` for each provider type
3. Integrate Better Auth for OAuth flows
4. Build credential encryption in `src/infrastructure/security/vault.ts`
5. Create connection UI in `src/presentation/components/connections/`
6. Add E2E tests for OAuth flows

**Dependencies**: Phase 4 (automations use connections for actions)

**Success Criteria**:

- OAuth providers successfully authenticate
- Email services send emails through connections
- Stripe integration processes payments
- Credentials securely encrypted at rest
- Connection health monitored

---

### Phase 6: UI Metadata & Polish (v1.0.0) ⏳

**Status**: ⏳ **NOT STARTED**

**Target Date**: Q4 2025

**Estimated Duration**: 2-3 weeks

**Goal**: Complete the application metadata and UI customization

**Features to Implement**:

#### Schema Changes:

- ⏳ `icon` property with 20 icon options
- ⏳ `color` property with 12 theme colors
- ⏳ `schemaVersion` property (read-only, auto-managed)

#### Infrastructure:

- ⏳ Icon rendering system
- ⏳ Theme color application (Tailwind CSS dynamic)
- ⏳ Schema version management
- ⏳ Migration system between schema versions
- ⏳ Admin UI for schema configuration

**Technical Approach**:

1. Add UI metadata to `src/domain/models/app/index.ts`
2. Create theme system in `src/presentation/styles/themes.ts`
3. Build icon library in `src/presentation/components/icons/`
4. Implement schema migration system
5. Create admin configuration UI

**Dependencies**: All previous phases (this is final polish)

**Success Criteria**:

- Application icon displays throughout UI
- Theme colors apply globally
- Schema versioning tracks changes
- Admin UI allows configuration editing
- Documentation complete for v1.0.0

---

## Migration Path

### From v0.0.1 to v0.1.0

- **Breaking Change**: Add `tables` property (optional in v0.1.0 for backward compatibility)
- **Migration**: Existing apps continue to work, new apps can add tables

### From v0.1.0 to v0.2.0

- **Non-Breaking**: New field types added
- **Migration**: Automatic, no changes required

### From v0.2.0 to v0.3.0

- **Breaking Change**: Add `pages` property (optional in v0.3.0)
- **Migration**: Existing apps work, pages enable new UI capabilities

### From v0.3.0 to v0.4.0

- **Non-Breaking**: Automations are additive
- **Migration**: Automatic, no changes required

### From v0.4.0 to v0.5.0

- **Non-Breaking**: Connections are additive
- **Migration**: Automatic, no changes required

### From v0.5.0 to v1.0.0

- **Breaking Change**: Add required `icon`, `color`, `schemaVersion` properties
- **Migration**: Auto-generate defaults (icon: "globe", color: "blue", schemaVersion: "1.0.0")

---

## Timeline Summary

| Quarter     | Phases    | Key Deliverables                                     |
| ----------- | --------- | ---------------------------------------------------- |
| **Q2 2025** | Phase 1-2 | Tables with all field types, CRUD API, file uploads  |
| **Q3 2025** | Phase 3-4 | Pages (4 types), automations with triggers/actions   |
| **Q4 2025** | Phase 5-6 | Connections, OAuth, UI metadata → **v1.0.0 Release** |

**Total Implementation Time**: ~6-8 months from Phase 1 start

---

## Success Metrics

### Phase 1 Success

- [ ] 100+ E2E tests passing for table operations
- [ ] CRUD API responds in <100ms for typical queries
- [ ] 5 basic field types fully functional

### Phase 2 Success

- [ ] Relationships properly establish foreign keys
- [ ] File uploads support local and S3 storage
- [ ] 9 field types fully implemented

### Phase 3 Success

- [ ] All 4 page types render correctly
- [ ] Form submissions save to database
- [ ] Table views support sorting, filtering, pagination

### Phase 4 Success

- [ ] Database triggers fire automations
- [ ] Scheduled automations run reliably
- [ ] Email actions send successfully

### Phase 5 Success

- [ ] 3+ OAuth providers integrated
- [ ] Credentials encrypted at rest
- [ ] External API calls properly rate-limited

### Phase 6 Success

- [ ] UI customization working (icon, color)
- [ ] Schema migrations tested
- [ ] v1.0.0 documentation complete

---

## Contributing

We welcome contributions at any phase! See our contribution guidelines for:

- How to pick up Phase tasks
- Testing requirements
- Code review process
- Documentation standards

---

## Related Documentation

- [Vision Document](docs/specifications/vision.md) - Product vision and target state
- [API Conventions](docs/architecture/api-conventions.md) - Convention-based API routing
- [Architecture](docs/architecture/layer-based-architecture.md) - Layer-based architecture
- [Testing Strategy](docs/architecture/testing-strategy.md) - Testing approach
- [Current Schema](schemas/0.0.1/app.schema.json) - Current implementation
- [Vision Schema](docs/specifications/specs.schema.json) - Target schema

---

**Last Updated**: 2025-01-17
**Current Version**: v0.0.1
**Next Milestone**: v0.1.0 (Phase 1)
