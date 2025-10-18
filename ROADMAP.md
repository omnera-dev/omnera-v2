# Omnera Development Roadmap

> **Flexible Development**: Work on any feature whenever you want. Each property has its own detailed implementation guide in `docs/specifications/roadmap/`.
>
> **Last Generated**: 2025-10-18

## Overview

### Current State (v0.0.1)

- **Schema**: `schemas/0.0.1/app.schema.json`
- **Implemented Properties**: 3 (name, description, version)
- **Status**: ✅ **3/7 Properties Complete**

### Vision State (v1.0.0)

- **Schema**: `docs/specifications/specs.schema.json`
- **Total Properties**: 7 (name, description, version, tables, pages, automations, connections)
- **Gap**: **~57%** of features not yet implemented

---

## Overall Progress

█████████████░░░░░░░░░░░░░░░░░ 43% Complete

### Status Summary

| Metric               | Count | Percentage |
| -------------------- | ----- | ---------- |
| **Total Properties** | 7     | 100%       |
| **Implemented**      | 3     | 43%        |
| **Partial**          | 0     | 0%         |
| **Missing**          | 4     | 57%        |

---

## Property Overview

| Property        | Status | Completion | Complexity | Implementation | Guide                                                  |
| --------------- | ------ | ---------- | ---------- | -------------- | ------------------------------------------------------ |
| **name**        | ✅     | 100%       | 15 pts     | -              | -                                                      |
| **description** | ✅     | 100%       | 5 pts      | -              | -                                                      |
| **version**     | ✅     | 100%       | 10 pts     | -              | -                                                      |
| **tables**      | ⏳     | 0%         | 10 pts     | -              | [📋 Guide](docs/specifications/roadmap/tables.md)      |
| **pages**       | ⏳     | 0%         | 10 pts     | -              | [📋 Guide](docs/specifications/roadmap/pages.md)       |
| **automations** | ⏳     | 0%         | 10 pts     | -              | [📋 Guide](docs/specifications/roadmap/automations.md) |
| **connections** | ⏳     | 0%         | 10 pts     | -              | [📋 Guide](docs/specifications/roadmap/connections.md) |

**Legend**: ✅ Done | 🚧 In Progress | ⏳ Not Started

---

## All Properties (7 total)

Properties organized hierarchically: Automations (Triggers > Actions by service), Connections (by service), Pages (by type), Tables (fields by type).

**Legend**: ✅ Complete | 🚧 Partial | ⏳ Not Started

## Other Properties

| Property Path   | Status | Schema | Tests | Quality | Guide                                                  |
| --------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------ |
| **name**        | ✅     | ✅     | -     | ✅      | -                                                      |
| **description** | ✅     | ✅     | -     | ✅      | -                                                      |
| **version**     | ✅     | ✅     | -     | ✅      | -                                                      |
| **tables**      | ⏳     | 🚧     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables.md)      |
| **pages**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages.md)       |
| **automations** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automations.md) |
| **connections** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections.md) |

---

## Feature Status by Category

| Category                 | Feature     | Current | Vision | Status  |
| ------------------------ | ----------- | ------- | ------ | ------- |
| **Application Metadata** |             |         |        |         |
|                          | name        | ✅      | ✅     | ✅ 100% |
|                          | description | ✅      | ✅     | ✅ 100% |
| **Tables**               |             |         |        |         |
|                          | tables      | ❌      | ✅     | ⏳ 0%   |
| **Pages**                |             |         |        |         |
|                          | pages       | ❌      | ✅     | ⏳ 0%   |
| **Automations**          |             |         |        |         |
|                          | automations | ❌      | ✅     | ⏳ 0%   |
| **Connections**          |             |         |        |         |
|                          | connections | ❌      | ✅     | ⏳ 0%   |

---

## Dependencies

The following properties have dependencies:

- **automations** depends on: tables

---

## For Implementers

### Developers

- See individual property files in `docs/specifications/roadmap/` for detailed technical approach
- Each property includes success criteria and implementation guide
- Work on any property in any order (unless it has dependencies)

### Schema-Architect Agent

- Each property file contains **Effect Schema Blueprints** with copy-pasteable code
- Validation rules include exact error messages
- All annotations (title, description, examples) are specified

### E2E-Red-Test-Writer Agent

- Each property file contains **Playwright Test Blueprints**
- data-testid patterns are standardized
- Test scenarios use GIVEN-WHEN-THEN structure
- @spec, @regression, and @critical tests are clearly separated

---

**Suggested Next Step**: Work on **tables**
**Implementation Guide**: [📋 tables](docs/specifications/roadmap/tables.md)
**Complexity**: 10 points
