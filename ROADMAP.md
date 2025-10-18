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
| **tables**      | ⏳     | 0%         | 5 pts      | -              | [📋 Guide](docs/specifications/roadmap/tables.md)      |
| **pages**       | ⏳     | 0%         | 10 pts     | -              | [📋 Guide](docs/specifications/roadmap/pages.md)       |
| **automations** | ⏳     | 0%         | 5 pts      | -              | [📋 Guide](docs/specifications/roadmap/automations.md) |
| **connections** | ⏳     | 0%         | 5 pts      | -              | [📋 Guide](docs/specifications/roadmap/connections.md) |

**Legend**: ✅ Done | 🚧 In Progress | ⏳ Not Started

---

## All Properties (391 total)

Properties organized hierarchically: Automations (Triggers > Actions by service), Connections (by service), Pages (by type), Tables (fields by type).

**Legend**: ✅ Complete | 🚧 Partial | ⏳ Not Started

## Automations

### Triggers

#### Airtable

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                                 |
| ------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------- |
| **record-created** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/airtable/record-created.md) |

#### Calendly

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                                 |
| ------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------- |
| **invite-created** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/calendly/invite-created.md) |

#### Database

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                                 |
| ------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------- |
| **record-created** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/database/record-created.md) |
| **record-updated** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/database/record-updated.md) |

#### Facebook Ads

| Property Path | Status | Schema | Tests | Quality | Guide                                                                               |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------- |
| **new-lead**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/facebook-ads/new-lead.md) |

#### HTTP

| Property Path | Status | Schema | Tests | Quality | Guide                                                                   |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------- |
| **post**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/http/post.md) |
| **get**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/http/get.md)  |

#### LinkedIn Ads

| Property Path                  | Status | Schema | Tests | Quality | Guide                                                                                                 |
| ------------------------------ | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------------------------- |
| **new-lead-gen-form-response** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/linkedin-ads/new-lead-gen-form-response.md) |

#### Schedule

| Property Path | Status | Schema | Tests | Quality | Guide                                                                            |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **cron-time** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_trigger/schedule/cron-time.md) |

### Actions

#### Airtable

| Property Path             | Status | Schema | Tests | Quality | Guide                                                                                       |
| ------------------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------------- |
| **list-webhook-payloads** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/airtable/list-webhook-payloads.md) |

#### Calendly

| Property Path                  | Status | Schema | Tests | Quality | Guide                                                                                            |
| ------------------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------------------ |
| **list-webhook-subscriptions** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/calendly/list-webhook-subscriptions.md) |
| **get-event-type**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/calendly/get-event-type.md)             |

#### Code

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                            |
| ------------------ | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **run-typescript** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/code/run-typescript.md) |
| **run-javascript** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/code/run-javascript.md) |

#### Database

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                               |
| ----------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------- |
| **create-record** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/database/create-record.md) |

#### Facebook Ads

| Property Path              | Status | Schema | Tests | Quality | Guide                                                                                            |
| -------------------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------------------ |
| **list-app-subscriptions** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/facebook-ads/list-app-subscriptions.md) |
| **get-leadgen**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/facebook-ads/get-leadgen.md)            |

#### Filter

| Property Path        | Status | Schema | Tests | Quality | Guide                                                                                |
| -------------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------ |
| **only-continue-if** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/filter/only-continue-if.md) |
| **split-into-paths** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/filter/split-into-paths.md) |

#### Google Gmail

| Property Path  | Status | Schema | Tests | Quality | Guide                                                                                |
| -------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------ |
| **send-email** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/google-gmail/send-email.md) |

#### Google Sheets

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                                    |
| ----------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------------------- |
| **append-values** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/google-sheets/append-values.md) |

#### HTTP

| Property Path | Status | Schema | Tests | Quality | Guide                                                                      |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **get**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/http/get.md)      |
| **post**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/http/post.md)     |
| **response**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/http/response.md) |

#### LinkedIn Ads

| Property Path                             | Status | Schema | Tests | Quality | Guide                                                                                                           |
| ----------------------------------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------------------------------------- |
| **create-lead-notification-subscription** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/linkedin-ads/create-lead-notification-subscription.md) |
| **list-lead-notification-subscriptions**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/linkedin-ads/list-lead-notification-subscriptions.md)  |
| **get-lead-form-response**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/linkedin-ads/get-lead-form-response.md)                |

#### Notion

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                            |
| ---------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **create-page**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/notion/create-page.md)  |
| **get-page**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/notion/get-page.md)     |
| **update-page**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/notion/update-page.md)  |
| **delete-page**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/notion/delete-page.md)  |
| **list-pages**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/notion/list-pages.md)   |
| **search-pages** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/notion/search-pages.md) |

#### Qonto

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                             |
| ------------------ | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **create-client**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/qonto/create-client.md)  |
| **create-invoice** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/automation_action/qonto/create-invoice.md) |

## Connections

### Airtable

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                        |
| ---------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/id.md)           |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/connections/airtable/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/airtable/service.md)      |

### Calendly

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                        |
| ---------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/id.md)           |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/connections/calendly/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/calendly/service.md)      |

### Facebook Ads

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                            |
| ---------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/id.md)           |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/facebook-ads/service.md)      |

### LinkedIn Ads

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                             |
| ---------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/id.md)           |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/linked-in-ads/service.md)      |

### Notion

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                      |
| ---------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/id.md)           |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/connections/notion/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/notion/service.md)      |

### Qonto

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                     |
| ---------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/id.md)           |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/connections/qonto/name.md)         |
| **clientId**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/clientId.md)     |
| **clientSecret** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/clientSecret.md) |
| **service**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/connections/qonto/service.md)      |

## Pages

### Custom HTML Page

| Property Path                     | Status | Schema | Tests | Quality | Guide                                                                                           |
| --------------------------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------------------- |
| **type**                          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/type.md)                          |
| **name**                          | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/name.md)                          |
| **path**                          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/path.md)                          |
| **head**                          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head.md)                          |
| **head/meta-element/tag**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/meta-element/tag.md)         |
| **head/meta-element/name**        | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/custom-html-page/head/meta-element/name.md)        |
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
| **name**            | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/detail-view-page/name.md)            |
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
| **name**           | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/name.md)           |
| **path**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/path.md)           |
| **title**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/title.md)          |
| **description**    | ⏳     | 🚧     | 16/3  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/description.md)    |
| **inputs**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs.md)         |
| **action**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/action.md)         |
| **table**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/table.md)          |
| **successMessage** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/successMessage.md) |
| **redirectUrl**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/redirectUrl.md)    |

#### Attachment Input

| Property Path   | Status | Schema | Tests | Quality | Guide                                                                                          |
| --------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------------------------- |
| **name**        | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/name.md)        |
| **label**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/label.md)       |
| **description** | ⏳     | 🚧     | 16/3  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/description.md) |
| **required**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/required.md)    |
| **accept**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/accept.md)      |
| **type**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/attachment-input/type.md)        |

#### Checkbox Input

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                                         |
| ---------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------------------- |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/name.md)         |
| **label**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/label.md)        |
| **description**  | ⏳     | 🚧     | 16/3  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/description.md)  |
| **required**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/required.md)     |
| **defaultValue** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/defaultValue.md) |
| **type**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/checkbox-input/type.md)         |

#### Select Input

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                                        |
| ----------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------------------- |
| **name**          | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/name.md)          |
| **label**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/label.md)         |
| **description**   | ⏳     | 🚧     | 16/3  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/select-input/description.md)   |
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
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/name.md)         |
| **label**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/label.md)        |
| **description**  | ⏳     | 🚧     | 16/3  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/description.md)  |
| **required**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/required.md)     |
| **defaultValue** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/defaultValue.md) |
| **placeholder**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/placeholder.md)  |
| **type**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/form-page/inputs/text-input/type.md)         |

### Table View Page

| Property Path      | Status | Schema | Tests | Quality | Guide                                                                           |
| ------------------ | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------- |
| **type**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/type.md)           |
| **name**           | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/pages/table-view-page/name.md)           |
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
| **name**                     | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/name.md)                     |
| **fields**                   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields.md)                   |
| **primaryKey**               | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/primaryKey.md)               |
| **primaryKey/type**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/primaryKey/type.md)          |
| **primaryKey/field**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/primaryKey/field.md)         |
| **primaryKey/fields**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/primaryKey/fields.md)        |
| **uniqueConstraints**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/uniqueConstraints.md)        |
| **uniqueConstraints/name**   | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/uniqueConstraints/name.md)   |
| **uniqueConstraints/fields** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/uniqueConstraints/fields.md) |
| **indexes**                  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/indexes.md)                  |
| **indexes/name**             | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/indexes/name.md)             |
| **indexes/fields**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/indexes/fields.md)           |
| **indexes/unique**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/indexes/unique.md)           |

### Array Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                         |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/type.md)     |
| **itemType**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/itemType.md) |
| **maxItems**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/array-field/maxItems.md) |

### Autonumber Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                               |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/id.md)        |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/name.md)      |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/type.md)      |
| **prefix**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/prefix.md)    |
| **startFrom** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/startFrom.md) |
| **digits**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/autonumber-field/digits.md)    |

### Barcode Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                           |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/barcode-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/barcode-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/barcode-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/barcode-field/type.md)     |
| **format**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/barcode-field/format.md)   |

### Button Field

| Property Path  | Status | Schema | Tests | Quality | Guide                                                                            |
| -------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/id.md)         |
| **name**       | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/name.md)       |
| **type**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/type.md)       |
| **label**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/label.md)      |
| **action**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/action.md)     |
| **url**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/url.md)        |
| **automation** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/button-field/automation.md) |

### Checkbox Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                            |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/checkbox-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/checkbox-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/checkbox-field/required.md) |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/checkbox-field/indexed.md)  |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/checkbox-field/type.md)     |
| **default**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/checkbox-field/default.md)  |

### Color Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                         |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/color-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/color-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/color-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/color-field/type.md)     |
| **default**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/color-field/default.md)  |

### Created At Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                             |
| ------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-at-field/id.md)      |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-at-field/name.md)    |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-at-field/type.md)    |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-at-field/indexed.md) |

### Created By Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                             |
| ------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-by-field/id.md)      |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-by-field/name.md)    |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-by-field/type.md)    |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/created-by-field/indexed.md) |

### Date Field

| Property Path   | Status | Schema | Tests | Quality | Guide                                                                           |
| --------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------- |
| **id**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/id.md)          |
| **name**        | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/name.md)        |
| **required**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/required.md)    |
| **unique**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/unique.md)      |
| **indexed**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/indexed.md)     |
| **type**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/type.md)        |
| **format**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/format.md)      |
| **includeTime** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/includeTime.md) |
| **timezone**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/timezone.md)    |
| **default**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/date-field/default.md)     |

### Duration Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                            |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/duration-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/duration-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/duration-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/duration-field/type.md)     |
| **format**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/duration-field/format.md)   |

### Formula Field

| Property Path  | Status | Schema | Tests | Quality | Guide                                                                             |
| -------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/formula-field/id.md)         |
| **name**       | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/formula-field/name.md)       |
| **type**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/formula-field/type.md)       |
| **formula**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/formula-field/formula.md)    |
| **resultType** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/formula-field/resultType.md) |
| **format**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/formula-field/format.md)     |

### Geolocation Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                               |
| ------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/geolocation-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/geolocation-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/geolocation-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/geolocation-field/type.md)     |

### JSON Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                        |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/json-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/json-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/json-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/json-field/type.md)     |
| **schema**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/json-field/schema.md)   |

### Lookup Field

| Property Path         | Status | Schema | Tests | Quality | Guide                                                                                   |
| --------------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------------- |
| **id**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/lookup-field/id.md)                |
| **name**              | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/lookup-field/name.md)              |
| **type**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/lookup-field/type.md)              |
| **relationshipField** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/lookup-field/relationshipField.md) |
| **relatedField**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/lookup-field/relatedField.md)      |

### Multi Select Field

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                                     |
| ----------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------------- |
| **id**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/id.md)            |
| **name**          | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/name.md)          |
| **required**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/required.md)      |
| **indexed**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/indexed.md)       |
| **type**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/type.md)          |
| **options**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/options.md)       |
| **maxSelections** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/maxSelections.md) |
| **default**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multi-select-field/default.md)       |

### Multiple Attachments Field

| Property Path            | Status | Schema | Tests | Quality | Guide                                                                                                    |
| ------------------------ | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------------------------------- |
| **id**                   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/id.md)                   |
| **name**                 | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/name.md)                 |
| **required**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/required.md)             |
| **indexed**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/indexed.md)              |
| **type**                 | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/type.md)                 |
| **maxFiles**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/maxFiles.md)             |
| **storage**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/storage.md)              |
| **storage/provider**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/storage/provider.md)     |
| **storage/bucket**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/storage/bucket.md)       |
| **storage/maxSize**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/storage/maxSize.md)      |
| **storage/allowedTypes** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/multiple-attachments-field/storage/allowedTypes.md) |

### Number Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                           |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/id.md)        |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/name.md)      |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/required.md)  |
| **unique**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/unique.md)    |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/indexed.md)   |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/type.md)      |
| **min**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/min.md)       |
| **max**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/max.md)       |
| **precision** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/precision.md) |
| **currency**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/currency.md)  |
| **default**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/number-field/default.md)   |

### Progress Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                            |
| ------------- | ------ | ------ | ----- | ------- | -------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/progress-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/progress-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/progress-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/progress-field/type.md)     |
| **color**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/progress-field/color.md)    |

### Rating Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                          |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------ |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/required.md) |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/type.md)     |
| **max**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/max.md)      |
| **style**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rating-field/style.md)    |

### Relationship Field

| Property Path    | Status | Schema | Tests | Quality | Guide                                                                                    |
| ---------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------------------- |
| **id**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/id.md)           |
| **name**         | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/name.md)         |
| **required**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/required.md)     |
| **indexed**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/indexed.md)      |
| **type**         | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/type.md)         |
| **relatedTable** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/relatedTable.md) |
| **relationType** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/relationType.md) |
| **displayField** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/displayField.md) |
| **onDelete**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/onDelete.md)     |
| **onUpdate**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/relationship-field/onUpdate.md)     |

### Rich Text Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                              |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rich-text-field/id.md)        |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/rich-text-field/name.md)      |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rich-text-field/required.md)  |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rich-text-field/type.md)      |
| **maxLength** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rich-text-field/maxLength.md) |

### Rollup Field

| Property Path         | Status | Schema | Tests | Quality | Guide                                                                                   |
| --------------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------------- |
| **id**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/id.md)                |
| **name**              | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/name.md)              |
| **type**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/type.md)              |
| **relationshipField** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/relationshipField.md) |
| **relatedField**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/relatedField.md)      |
| **aggregation**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/aggregation.md)       |
| **format**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/rollup-field/format.md)            |

### Single Attachment Field

| Property Path            | Status | Schema | Tests | Quality | Guide                                                                                                 |
| ------------------------ | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------------------------- |
| **id**                   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/id.md)                   |
| **name**                 | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/name.md)                 |
| **required**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/required.md)             |
| **indexed**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/indexed.md)              |
| **type**                 | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/type.md)                 |
| **storage**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/storage.md)              |
| **storage/provider**     | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/storage/provider.md)     |
| **storage/bucket**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/storage/bucket.md)       |
| **storage/maxSize**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/storage/maxSize.md)      |
| **storage/allowedTypes** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-attachment-field/storage/allowedTypes.md) |

### Single Select Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                                 |
| ------------- | ------ | ------ | ----- | ------- | ------------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/required.md) |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/indexed.md)  |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/type.md)     |
| **options**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/options.md)  |
| **default**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/single-select-field/default.md)  |

### Status Field

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                               |
| ----------------- | ------ | ------ | ----- | ------- | ----------------------------------------------------------------------------------- |
| **id**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/id.md)            |
| **name**          | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/name.md)          |
| **required**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/required.md)      |
| **indexed**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/indexed.md)       |
| **type**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/type.md)          |
| **options**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/options.md)       |
| **options/value** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/options/value.md) |
| **options/color** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/options/color.md) |
| **default**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/status-field/default.md)       |

### Text Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                        |
| ------------- | ------ | ------ | ----- | ------- | ---------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/text-field/id.md)       |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/text-field/name.md)     |
| **required**  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/text-field/required.md) |
| **unique**    | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/text-field/unique.md)   |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/text-field/indexed.md)  |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/text-field/type.md)     |
| **default**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/text-field/default.md)  |

### Updated At Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                             |
| ------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-at-field/id.md)      |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-at-field/name.md)    |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-at-field/type.md)    |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-at-field/indexed.md) |

### Updated By Field

| Property Path | Status | Schema | Tests | Quality | Guide                                                                             |
| ------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**        | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-by-field/id.md)      |
| **name**      | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-by-field/name.md)    |
| **type**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-by-field/type.md)    |
| **indexed**   | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/updated-by-field/indexed.md) |

### User Field

| Property Path     | Status | Schema | Tests | Quality | Guide                                                                             |
| ----------------- | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------------- |
| **id**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/user-field/id.md)            |
| **name**          | ⏳     | 🚧     | 21/5  | ✅      | [📋 Guide](docs/specifications/roadmap/tables/fields/user-field/name.md)          |
| **required**      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/user-field/required.md)      |
| **indexed**       | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/user-field/indexed.md)       |
| **type**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/user-field/type.md)          |
| **allowMultiple** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/tables/fields/user-field/allowMultiple.md) |

## Other Properties

| Property Path                        | Status | Schema | Tests | Quality | Guide                                                                       |
| ------------------------------------ | ------ | ------ | ----- | ------- | --------------------------------------------------------------------------- |
| **name**                             | ✅     | ✅     | 21/5  | ✅      | -                                                                           |
| **description**                      | ✅     | ✅     | 16/3  | ✅      | -                                                                           |
| **version**                          | ✅     | ✅     | 8/4   | ✅      | -                                                                           |
| **tables**                           | ⏳     | ⏳     | 0/4   | ⏳      | [📋 Guide](docs/specifications/roadmap/tables.md)                           |
| **pages**                            | ⏳     | ⏳     | 0/5   | ⏳      | [📋 Guide](docs/specifications/roadmap/pages.md)                            |
| **automations**                      | ⏳     | ⏳     | 0/6   | ⏳      | [📋 Guide](docs/specifications/roadmap/automations.md)                      |
| **connections**                      | ⏳     | ⏳     | 0/3   | ⏳      | [📋 Guide](docs/specifications/roadmap/connections.md)                      |
| **filter_condition**                 | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/filter_condition.md)                 |
| **json_schema**                      | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema.md)                      |
| **json_schema/type**                 | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/type.md)                 |
| **json_schema/properties**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/properties.md)           |
| **json_schema/required**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/required.md)             |
| **json_schema/items**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/items.md)                |
| **json_schema/additionalProperties** | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/additionalProperties.md) |
| **json_schema/enum**                 | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/enum.md)                 |
| **json_schema/const**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/const.md)                |
| **json_schema/title**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/title.md)                |
| **json_schema/description**          | ⏳     | 🚧     | 16/3  | ✅      | [📋 Guide](docs/specifications/roadmap/json_schema/description.md)          |
| **json_schema/default**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/default.md)              |
| **json_schema/minimum**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/minimum.md)              |
| **json_schema/maximum**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/maximum.md)              |
| **json_schema/multipleOf**           | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/multipleOf.md)           |
| **json_schema/minLength**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/minLength.md)            |
| **json_schema/maxLength**            | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/maxLength.md)            |
| **json_schema/pattern**              | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/pattern.md)              |
| **json_schema/minItems**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/minItems.md)             |
| **json_schema/maxItems**             | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/maxItems.md)             |
| **json_schema/uniqueItems**          | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/uniqueItems.md)          |
| **json_schema/allOf**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/allOf.md)                |
| **json_schema/anyOf**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/anyOf.md)                |
| **json_schema/oneOf**                | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/oneOf.md)                |
| **json_schema/not**                  | ⏳     | ⏳     | -     | ⏳      | [📋 Guide](docs/specifications/roadmap/json_schema/not.md)                  |

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
- @spec, @regression, and @critical tests are clearly separated

---

**Suggested Next Step**: Work on **tables**
**Implementation Guide**: [📋 tables](docs/specifications/roadmap/tables.md)
**Complexity**: 5 points
