# Omnera Development Roadmap

> **Flexible Development**: Work on any feature whenever you want. Each property has its own detailed implementation guide in `docs/specifications/roadmap/`.
>
> **Last Generated**: 2025-10-20

## Overview

### Current State (v0.0.1)

- **Schema**: `schemas/0.0.1/app.schema.json`
- **Implemented Properties**: 3 (name, description, version)
- **Status**: ✅ **3/396 Properties Complete**

### Vision State (v1.0.0)

- **Schema**: `docs/specifications/specs.schema.json`
- **Total Properties**: 396 (name, description, version, tables, pages, automations, connections)
- **Gap**: **~43%** of features not yet implemented

---

## Overall Progress

█████████████████░░░░░░░░░░░░░ 57% Complete

### Status Summary

| Metric               | Count | Percentage |
| -------------------- | ----- | ---------- |
| **Total Properties** | 396   | 100%       |
| **Implemented**      | 195   | 49%        |
| **Partial**          | 18    | 5%         |
| **Missing**          | 183   | 46%        |

---

## Property Overview

| Property        | Status | Completion | Complexity | Implementation | Guide                                                  |
| --------------- | ------ | ---------- | ---------- | -------------- | ------------------------------------------------------ |
| **name**        | ✅     | 100%       | 15 pts     | -              | -                                                      |
| **description** | ✅     | 100%       | 5 pts      | -              | -                                                      |
| **version**     | ✅     | 100%       | 10 pts     | -              | -                                                      |
| **tables**      | 🚧     | 100%       | 5 pts      | -              | [📋 Guide](docs/specifications/roadmap/tables.md)      |
| **pages**       | ⏳     | 0%         | 10 pts     | -              | [📋 Guide](docs/specifications/roadmap/pages.md)       |
| **automations** | ⏳     | 0%         | 5 pts      | -              | [📋 Guide](docs/specifications/roadmap/automations.md) |
| **connections** | ⏳     | 0%         | 5 pts      | -              | [📋 Guide](docs/specifications/roadmap/connections.md) |

**Legend**: ✅ Done | 🚧 In Progress | ⏳ Not Started

---

## All Properties (396 total)

Properties organized hierarchically: Automations (Triggers > Actions by service), Connections (by service), Pages (by type), Tables (fields by type).

**Legend**: ✅ Complete | 🚧 Partial | ⏳ Not Started

## Connections

### Airtable

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                        |
| ---------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/airtable/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/service.md)      |

### Calendly

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                        |
| ---------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/calendly/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/service.md)      |

### Facebook Ads

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                            |
| ---------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/service.md)      |

### Google Gmail

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                            |
| ---------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-gmail/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/google-gmail/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-gmail/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-gmail/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-gmail/service.md)      |

### Google Sheets

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                             |
| ---------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-sheets/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/google-sheets/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-sheets/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-sheets/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/google-sheets/service.md)      |

### LinkedIn Ads

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                             |
| ---------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/service.md)      |

### Notion

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                      |
| ---------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/notion/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/service.md)      |

### Qonto

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                     |
| ---------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/id.md)           |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/connections/qonto/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/service.md)      |

## Pages

### Custom HTML Page

| Property Path                     | Status | Schema | Tests | Quality | Guide                                                                                           |
| --------------------------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------------------- |
| **type**                          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/type.md)                          |
| **name**                          | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/name.md)                          |
| **path**                          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/path.md)                          |
| **head**                          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head.md)                          |
| **head/meta-element/tag**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/meta-element/tag.md)         |
| **head/meta-element/name**        | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/meta-element/name.md)        |
| **head/meta-element/content**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/meta-element/content.md)     |
| **head/title-element/tag**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/title-element/tag.md)        |
| **head/title-element/content**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/title-element/content.md)    |
| **head/script-element/tag**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/script-element/tag.md)       |
| **head/script-element/src**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/script-element/src.md)       |
| **head/script-element/content**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/script-element/content.md)   |
| **head/script-element/type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/script-element/type.md)      |
| **head/script-element/async**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/script-element/async.md)     |
| **head/script-element/defer**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/script-element/defer.md)     |
| **head/style-element/tag**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/style-element/tag.md)        |
| **head/style-element/content**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/style-element/content.md)    |
| **head/style-element/type**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/style-element/type.md)       |
| **head/style-element/media**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/style-element/media.md)      |
| **head/link-element/tag**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/link-element/tag.md)         |
| **head/link-element/href**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/link-element/href.md)        |
| **head/link-element/rel**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/link-element/rel.md)         |
| **head/link-element/type**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/link-element/type.md)        |
| **head/link-element/media**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/link-element/media.md)       |
| **head/link-element/sizes**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/link-element/sizes.md)       |
| **head/link-element/crossorigin** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/link-element/crossorigin.md) |
| **body**                          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/body.md)                          |
| **body/html-content/type**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/body/html-content/type.md)        |
| **body/html-content/content**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/body/html-content/content.md)     |

### Detail View Page

| Property Path       | Status | Schema | Tests | Quality | Guide                                                                             |
| ------------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **type**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/type.md)            |
| **name**            | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/name.md)            |
| **path**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/path.md)            |
| **table**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/table.md)           |
| **title**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/title.md)           |
| **layout**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/layout.md)          |
| **sections**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/sections.md)        |
| **sections/title**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/sections/title.md)  |
| **sections/fields** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/sections/fields.md) |

### Form Page

#### Form Page Metadata

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                     |
| ------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------- |
| **type**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/type.md)           |
| **id**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/id.md)             |
| **name**           | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/name.md)           |
| **path**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/path.md)           |
| **title**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/title.md)          |
| **description**    | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/description.md)    |
| **inputs**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs.md)         |
| **action**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/action.md)         |
| **table**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/table.md)          |
| **successMessage** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/successMessage.md) |
| **redirectUrl**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/redirectUrl.md)    |

#### Attachment Input

| Property Path   | Status | Schema | Tests | Quality | Guide                                                                                          |
| --------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------------------------- |
| **name**        | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/name.md)        |
| **label**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/label.md)       |
| **description** | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/description.md) |
| **required**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/required.md)    |
| **accept**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/accept.md)      |
| **type**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/type.md)        |

#### Checkbox Input

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                                         |
| ---------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------------------- |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/name.md)         |
| **label**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/label.md)        |
| **description**  | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/description.md)  |
| **required**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/required.md)     |
| **defaultValue** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/defaultValue.md) |
| **type**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/type.md)         |

#### Select Input

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                                        |
| ----------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------------------- |
| **name**          | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/name.md)          |
| **label**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/label.md)         |
| **description**   | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/description.md)   |
| **required**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/required.md)      |
| **defaultValue**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/defaultValue.md)  |
| **placeholder**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/placeholder.md)   |
| **options**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/options.md)       |
| **options/label** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/options/label.md) |
| **options/value** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/options/value.md) |
| **type**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/type.md)          |

#### Text Input

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                                     |
| ---------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------------- |
| **name**         | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/name.md)         |
| **label**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/label.md)        |
| **description**  | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/description.md)  |
| **required**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/required.md)     |
| **defaultValue** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/defaultValue.md) |
| **placeholder**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/placeholder.md)  |
| **type**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/type.md)         |

### Table View Page

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                           |
| ------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------- |
| **type**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/type.md)           |
| **name**           | ⏳     | 🚧     | -     | ✅      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/name.md)           |
| **path**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/path.md)           |
| **table**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/table.md)          |
| **title**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/title.md)          |
| **columns**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/columns.md)        |
| **searchable**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/searchable.md)     |
| **sortable**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/sortable.md)       |
| **filterable**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/filterable.md)     |
| **actions**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/actions.md)        |
| **actions/create** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/actions/create.md) |
| **actions/edit**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/actions/edit.md)   |
| **actions/delete** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/actions/delete.md) |
| **actions/export** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/actions/export.md) |

## Tables

### Table Metadata

| Property Path                | Status | Schema | Tests | Quality | Guide                                                                      |
| ---------------------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **id**                       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/id.md)                       |
| **name**                     | ✅     | 🚧     | -     | ✅      | -                                                                          |
| **fields**                   | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields.md)                   |
| **primaryKey**               | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **primaryKey/type**          | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **primaryKey/field**         | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **primaryKey/fields**        | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/primaryKey/fields.md)        |
| **uniqueConstraints**        | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/uniqueConstraints.md)        |
| **uniqueConstraints/name**   | ✅     | 🚧     | -     | ✅      | -                                                                          |
| **uniqueConstraints/fields** | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/uniqueConstraints/fields.md) |
| **indexes**                  | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/indexes.md)                  |
| **indexes/name**             | ✅     | 🚧     | -     | ✅      | -                                                                          |
| **indexes/fields**           | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/indexes/fields.md)           |
| **indexes/unique**           | ✅     | ⏳     | -     | ⏳      | -                                                                          |

### Array Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                         |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/id.md)       |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                             |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **itemType**  | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **maxItems**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/maxItems.md) |

### Autonumber Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                               |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/id.md)        |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                                   |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                                   |
| **prefix**    | ✅     | ⏳     | -     | ⏳      | -                                                                                   |
| **startFrom** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/startFrom.md) |
| **digits**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/digits.md)    |

### Barcode Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                     |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/barcode-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                         |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **format**    | ✅     | ⏳     | -     | ⏳      | -                                                                         |

### Button Field

| Property Path  | Status | Schema | Tests | Quality | Guide                                                                    |
| -------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------ |
| **id**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/id.md) |
| **name**       | ✅     | 🚧     | -     | ✅      | -                                                                        |
| **type**       | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **label**      | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **action**     | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **url**        | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **automation** | ✅     | ⏳     | -     | ⏳      | -                                                                        |

### Checkbox Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                      |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/checkbox-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                          |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                          |

### Color Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                   |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/color-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                       |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                       |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                       |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                       |

### Created At Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                        |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-at-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                            |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                            |

### Created By Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                        |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-by-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                            |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                            |

### Currency-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                        |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/currency-field/id.md)   |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                            |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/currency-field/type.md) |
| **min**       | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **max**       | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **currency**  | ✅     | ⏳     | -     | ⏳      | -                                                                            |

### Date Field

| Property Path   | Status | Schema | Tests | Quality | Guide                                                                  |
| --------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------- |
| **id**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/id.md) |
| **name**        | ✅     | 🚧     | -     | ✅      | -                                                                      |
| **required**    | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **unique**      | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **indexed**     | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **type**        | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **format**      | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **includeTime** | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **timezone**    | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **default**     | ✅     | ⏳     | -     | ⏳      | -                                                                      |

### Decimal-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                            |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/decimal-field/id.md)        |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                                |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/decimal-field/type.md)      |
| **min**       | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **max**       | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **precision** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/decimal-field/precision.md) |

### Duration Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                      |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/duration-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                          |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **format**    | ✅     | ⏳     | -     | ⏳      | -                                                                          |

### Email-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                     |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/email-field/id.md)   |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                         |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/email-field/type.md) |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                         |

### Formula Field

| Property Path  | Status | Schema | Tests | Quality | Guide                                                                     |
| -------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------- |
| **id**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/formula-field/id.md) |
| **name**       | ✅     | 🚧     | -     | ✅      | -                                                                         |
| **type**       | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **formula**    | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **resultType** | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **format**     | ✅     | ⏳     | -     | ⏳      | -                                                                         |

### Geolocation Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                         |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/geolocation-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                             |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                             |

### Integer-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                          |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------ |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/integer-field/id.md)      |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                              |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/integer-field/type.md)    |
| **min**       | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **max**       | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **default**   | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/integer-field/default.md) |

### JSON Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                      |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/json-field/id.md)     |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                          |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **schema**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/json-field/schema.md) |

### Long-text-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                         |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/long-text-field/id.md)   |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                             |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/long-text-field/type.md) |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                             |

### Lookup Field

| Property Path         | Status | Schema | Tests | Quality | Guide                                                                    |
| --------------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------ |
| **id**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/lookup-field/id.md) |
| **name**              | ✅     | 🚧     | -     | ✅      | -                                                                        |
| **type**              | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **relationshipField** | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **relatedField**      | ✅     | ⏳     | -     | ⏳      | -                                                                        |

### Multi Select Field

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                                     |
| ----------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------------- |
| **id**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/id.md)            |
| **name**          | ✅     | 🚧     | -     | ✅      | -                                                                                         |
| **required**      | ✅     | ⏳     | -     | ⏳      | -                                                                                         |
| **indexed**       | ✅     | ⏳     | -     | ⏳      | -                                                                                         |
| **type**          | ✅     | ⏳     | -     | ⏳      | -                                                                                         |
| **options**       | ✅     | ⏳     | -     | ⏳      | -                                                                                         |
| **maxSelections** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/maxSelections.md) |
| **default**       | ✅     | ⏳     | -     | ⏳      | -                                                                                         |

### Multiple Attachments Field

| Property Path            | Status | Schema | Tests | Quality | Guide                                                                                               |
| ------------------------ | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------------------------- |
| **id**                   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/id.md)              |
| **name**                 | ✅     | 🚧     | -     | ✅      | -                                                                                                   |
| **required**             | ✅     | ⏳     | -     | ⏳      | -                                                                                                   |
| **indexed**              | ✅     | ⏳     | -     | ⏳      | -                                                                                                   |
| **type**                 | ✅     | ⏳     | -     | ⏳      | -                                                                                                   |
| **maxFiles**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/maxFiles.md)        |
| **storage**              | ✅     | ⏳     | -     | ⏳      | -                                                                                                   |
| **storage/provider**     | ✅     | ⏳     | -     | ⏳      | -                                                                                                   |
| **storage/bucket**       | ✅     | ⏳     | -     | ⏳      | -                                                                                                   |
| **storage/maxSize**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/storage/maxSize.md) |
| **storage/allowedTypes** | ✅     | ⏳     | -     | ⏳      | -                                                                                                   |

### Percentage-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                          |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------ |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/percentage-field/id.md)   |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                              |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/percentage-field/type.md) |
| **min**       | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **max**       | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                              |

### Phone-number-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                            |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/phone-number-field/id.md)   |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                                |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                                |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/phone-number-field/type.md) |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                                |

### Progress Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                      |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/progress-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                          |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                          |
| **color**     | ✅     | ⏳     | -     | ⏳      | -                                                                          |

### Rating Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                     |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/id.md)  |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                         |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                         |
| **max**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/max.md) |
| **style**     | ✅     | ⏳     | -     | ⏳      | -                                                                         |

### Relationship Field

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                          |
| ---------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------ |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/id.md) |
| **name**         | ✅     | 🚧     | -     | ✅      | -                                                                              |
| **required**     | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **indexed**      | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **type**         | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **relatedTable** | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **relationType** | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **displayField** | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **onDelete**     | ✅     | ⏳     | -     | ⏳      | -                                                                              |
| **onUpdate**     | ✅     | ⏳     | -     | ⏳      | -                                                                              |

### Rich Text Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                              |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rich-text-field/id.md)        |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                                  |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                                  |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                                  |
| **maxLength** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rich-text-field/maxLength.md) |

### Rollup Field

| Property Path         | Status | Schema | Tests | Quality | Guide                                                                    |
| --------------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------ |
| **id**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/id.md) |
| **name**              | ✅     | 🚧     | -     | ✅      | -                                                                        |
| **type**              | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **relationshipField** | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **relatedField**      | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **aggregation**       | ✅     | ⏳     | -     | ⏳      | -                                                                        |
| **format**            | ✅     | ⏳     | -     | ⏳      | -                                                                        |

### Single Attachment Field

| Property Path            | Status | Schema | Tests | Quality | Guide                                                                                            |
| ------------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------------------ |
| **id**                   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/id.md)              |
| **name**                 | ✅     | 🚧     | -     | ✅      | -                                                                                                |
| **required**             | ✅     | ⏳     | -     | ⏳      | -                                                                                                |
| **indexed**              | ✅     | ⏳     | -     | ⏳      | -                                                                                                |
| **type**                 | ✅     | ⏳     | -     | ⏳      | -                                                                                                |
| **storage**              | ✅     | ⏳     | -     | ⏳      | -                                                                                                |
| **storage/provider**     | ✅     | ⏳     | -     | ⏳      | -                                                                                                |
| **storage/bucket**       | ✅     | ⏳     | -     | ⏳      | -                                                                                                |
| **storage/maxSize**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/storage/maxSize.md) |
| **storage/allowedTypes** | ✅     | ⏳     | -     | ⏳      | -                                                                                                |

### Single-line-text-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                                |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------ |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-line-text-field/id.md)   |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                                    |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                                    |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                                    |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                                    |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-line-text-field/type.md) |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                                    |

### Single Select Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                           |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                               |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                               |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                               |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                               |
| **options**   | ✅     | ⏳     | -     | ⏳      | -                                                                               |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                               |

### Status Field

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                         |
| ----------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------- |
| **id**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/id.md)      |
| **name**          | ✅     | 🚧     | -     | ✅      | -                                                                             |
| **required**      | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **indexed**       | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **type**          | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **options**       | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/options.md) |
| **options/value** | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **options/color** | ✅     | ⏳     | -     | ⏳      | -                                                                             |
| **default**       | ✅     | ⏳     | -     | ⏳      | -                                                                             |

### Updated At Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                        |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-at-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                            |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                            |

### Updated By Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                        |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-by-field/id.md) |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                            |
| **type**      | ✅     | ⏳     | -     | ⏳      | -                                                                            |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                            |

### Url-field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                   |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/url-field/id.md)   |
| **name**      | ✅     | 🚧     | -     | ✅      | -                                                                       |
| **required**  | ✅     | ⏳     | -     | ⏳      | -                                                                       |
| **unique**    | ✅     | ⏳     | -     | ⏳      | -                                                                       |
| **indexed**   | ✅     | ⏳     | -     | ⏳      | -                                                                       |
| **type**      | 🚧     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/url-field/type.md) |
| **default**   | ✅     | ⏳     | -     | ⏳      | -                                                                       |

### User Field

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                  |
| ----------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------- |
| **id**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/user-field/id.md) |
| **name**          | ✅     | 🚧     | -     | ✅      | -                                                                      |
| **required**      | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **indexed**       | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **type**          | ✅     | ⏳     | -     | ⏳      | -                                                                      |
| **allowMultiple** | ✅     | ⏳     | -     | ⏳      | -                                                                      |

## Other Properties

| Property Path   | Status | Schema | Tests | Quality | Guide                                                  |
| --------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------ |
| **name**        | ✅     | ✅     | -     | ✅      | -                                                      |
| **description** | ✅     | ✅     | -     | ✅      | -                                                      |
| **version**     | ✅     | ✅     | -     | ✅      | -                                                      |
| **tables**      | 🚧     | ✅     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables.md)      |
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
|                          | tables      | ✅      | ✅     | 🚧 100% |
| **Pages**                |             |         |        |         |
|                          | pages       | ❌      | ✅     | ⏳ 0%   |
| **Automations**          |             |         |        |         |
|                          | automations | ❌      | ✅     | ⏳ 0%   |
| **Connections**          |             |         |        |         |
|                          | connections | ❌      | ✅     | ⏳ 0%   |

---

## Dependencies

The following properties have dependencies:

- **pages** depends on: tables
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
- @spec, @regression, and @spec tests are clearly separated

---

**Suggested Next Step**: Work on **pages**
**Implementation Guide**: [📋 pages](docs/specifications/roadmap/pages.md)
**Complexity**: 10 points
