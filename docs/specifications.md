# Omnera Specifications

> **⚠️ Vision Document**: This document describes the **target state** and **product roadmap** for Omnera. Most features described here are **not yet implemented**. For current capabilities and implementation status, see [STATUS.md](../STATUS.md).

## Overview

**Omnera is a source-available, self-hosted alternative to no-code/low-code SaaS platforms** like Airtable, Zapier, Retool, Webflow, and Notion.

Instead of visual drag-and-drop interfaces, Omnera uses **JSON/TypeScript configuration** to build full-featured applications. It's delivered as an **npm package** that runs on your own infrastructure, giving you complete control over your data and deployment.

### The Problem with Traditional No-Code Tools

Traditional no-code platforms (Airtable, Retool, Notion, Webflow, Zapier) have significant limitations:

- **Vendor Lock-in**: Your data and applications are trapped in proprietary platforms
- **SaaS Costs**: Monthly per-user fees that scale exponentially
- **Limited Control**: Can't customize beyond provided features
- **Data Privacy**: Your data lives on third-party servers
- **No Source Access**: Can't inspect, modify, or extend the platform

### The Omnera Approach

Omnera provides the **power of no-code platforms** with the **freedom of open-source software**:

- ✅ **Self-Hosted**: Run on your own infrastructure (AWS, Vercel, Docker, etc.)
- ✅ **Source-Available**: Full source code access under BSL 1.1 license
- ✅ **JSON Configuration**: Define everything in version-controlled JSON/TypeScript files
- ✅ **npm Package**: Install and deploy like any Node.js/Bun application
- ✅ **No Visual UI Needed**: Configure via code, not drag-and-drop
- ✅ **Type-Safe**: Full TypeScript support with compile-time validation
- ✅ **Complete Control**: Own your data, customize everything, extend as needed

### Configuration-as-Code Philosophy

Unlike traditional no-code tools with visual builders, Omnera embraces **configuration-as-code**:

```typescript
// config.ts - Your entire application defined in JSON
export default {
  name: 'MyApp',
  tables: [
    {
      /* database schema */
    },
  ],
  pages: [
    {
      /* UI routes */
    },
  ],
  automations: [
    {
      /* workflows */
    },
  ],
  forms: [
    {
      /* data collection */
    },
  ],
  integrations: [
    {
      /* external services */
    },
  ],
}
```

**Benefits of JSON Configuration:**

- ✅ Version control (Git)
- ✅ Code review workflows
- ✅ Type safety and validation
- ✅ Easy replication and templating
- ✅ No GUI complexity
- ✅ Perfect for developers and DevOps teams

Omnera interprets this configuration at runtime to automatically create and serve full-featured web applications without code generation.

## Core Architecture

```
Configuration (JSON/TypeScript) → Omnera Runtime → Live Application
```

The runtime server:

- Interprets configuration in real-time
- Auto-configures all features based on specification
- Handles frontend, backend, database, and APIs
- Updates live when configuration changes

## Configuration Schema

### Tables

Define data structures with automatic database management:

- Field types: text, email, number, date, boolean, select, file
- Automatic CRUD operations and REST APIs
- Built-in relationships and validations
- No SQL or ORM code required

### Pages

Configure web interfaces:

- Dynamic routing from path definitions
- Auto-generated forms from table schemas
- Data tables with sorting/filtering
- Authentication pages (login, register, reset)
- Admin dashboards

### Automations

Event-driven workflows:

- **Triggers**: database events, schedules, webhooks, form submissions
- **Actions**: send emails, update data, call APIs, run code
- **Conditions**: if-then rules, data validation
- Template variables with `{{variable}}` syntax

### Forms

Data collection interfaces:

- Input types matching table field types
- Built-in validation
- File uploads
- Multi-step forms
- Submission handling

### Integrations

External service connections:

- OAuth providers (Google, GitHub, etc.)
- Payment systems (Stripe)
- Email services (SMTP, Resend)
- APIs and webhooks
- Cloud storage

## Built-in Features

### Automatic Infrastructure

- Web server (Hono)
- Database (PostgreSQL via Drizzle ORM)
- Authentication (Better Auth)
- File storage
- Email service
- Background jobs
- API documentation

### Data Management

- Automatic table creation from schema
- CRUD operations without coding
- Data relationships
- Field validations
- Export capabilities

### User Interface

- React-based frontend
- Tailwind CSS styling
- Responsive design
- Admin panels
- Data visualization

## Use Cases

### Static Websites

Marketing sites, landing pages, documentation portals

### Internal Tools

Admin dashboards, data management, employee portals

### Customer Portals

Self-service interfaces, support systems, account management

### APIs

REST endpoints, webhooks, third-party integrations

### Business Applications

CRM systems, inventory management, project tracking

## Technical Implementation

### Installation

```javascript
import { start } from 'omnera'
import config from './config.json'

start(config)
```

### Configuration Example

```TypeScript
{
  name: "MyApp",
  tables: [{
    name: "users",
    fields: [
      { name: "email", type: "email" },
      { name: "name", type: "text" },
      { name: "role", type: "select", options: ["admin", "user"] }
    ]
  }],
  pages: [{
    path: "/dashboard",
    title: "Dashboard",
    table: "users"
  }],
  automations: [{
    trigger: "users.created",
    action: "sendEmail",
    template: "welcome"
  }]
}
```

## Performance Metrics

- Setup time: 2-3 days vs 2-3 months traditional
- Cost reduction: 80-90%
- Time to market: 95% faster
- Zero maintenance overhead
- Instant updates without deployment

## Limitations

Not suitable for:

- Real-time gaming applications
- High-frequency trading systems
- Complex computational workloads
- Native mobile applications

## Key Advantages Over Traditional No-Code Tools

### 1. **Self-Hosted & Source-Available**

- Own your data and infrastructure
- No vendor lock-in or platform risk
- Full source code access (BSL 1.1)
- Deploy anywhere: AWS, Vercel, Docker, bare metal

### 2. **Configuration-as-Code**

- JSON/TypeScript instead of visual builders
- Version control with Git
- Code review workflows
- Easy to replicate and template

### 3. **Developer-First Design**

- TypeScript type safety
- npm package installation
- Familiar development workflows
- No GUI learning curve

### 4. **Zero Ongoing Costs**

- No per-user SaaS fees
- No monthly subscriptions
- Free for internal business use
- Pay only for infrastructure

### 5. **Complete Platform**

- Runtime interpretation (no code generation)
- All infrastructure included (server, database, auth)
- Live configuration updates
- No external service dependencies

### 6. **Full Extensibility**

- Modify and extend the platform
- Add custom features
- Integrate with any service
- No platform limitations

## Competitive Comparison

| Feature             | Omnera          | Airtable       | Retool         | Zapier         | Webflow        |
| ------------------- | --------------- | -------------- | -------------- | -------------- | -------------- |
| **Self-Hosted**     | ✅ Yes          | ❌ No          | ❌ No          | ❌ No          | ❌ No          |
| **Source Access**   | ✅ BSL 1.1      | ❌ Proprietary | ❌ Proprietary | ❌ Proprietary | ❌ Proprietary |
| **Configuration**   | JSON/TypeScript | Visual UI      | Visual UI      | Visual UI      | Visual UI      |
| **Version Control** | ✅ Git-native   | ⚠️ Limited     | ⚠️ Limited     | ❌ No          | ⚠️ Limited     |
| **Data Ownership**  | ✅ Your servers | ❌ Their cloud | ❌ Their cloud | ❌ Their cloud | ❌ Their cloud |
| **Monthly Cost**    | $0 (infra only) | $20+/user      | $10+/user      | $20+/user      | $12+/site      |
| **Customization**   | ✅ Full access  | ⚠️ Limited     | ⚠️ Limited     | ⚠️ Limited     | ⚠️ Limited     |
| **Type Safety**     | ✅ TypeScript   | ❌ No          | ❌ No          | ❌ No          | ❌ No          |

## Contact

- Website: omnera.dev
- Documentation: docs.omnera.dev
- NPM: npmjs.com/package/omnera
