# Omnera Specifications

## Overview

Omnera is an npm package that runs a configuration-driven application server. It interprets JSON/TypeScript configuration to automatically create and serve web applications without code generation.

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
import Omnera from 'omnera'
import config from './config.json'

Omnera.start(config)
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

## Key Advantages

1. **No Code Generation**: Runtime interpretation only
2. **Live Configuration**: Changes apply instantly
3. **Complete Platform**: All infrastructure included
4. **Zero Dependencies**: No external services required
5. **Type Safety**: TypeScript configuration support

## Contact

- Website: omnera.dev
- Documentation: docs.omnera.dev
- NPM: npmjs.com/package/omnera
