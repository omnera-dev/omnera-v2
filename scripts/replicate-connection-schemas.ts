#!/usr/bin/env bun

/**
 * Script to replicate Airtable connection schema structure for other services
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const BASE_DIR = '/Users/thomasjeanneau/Codes/omnera-v2/specs/app/connections'

const SERVICES = [
  {
    key: 'calendly',
    name: 'Calendly',
    description:
      'OAuth-based integration with Calendly platform for scheduling and calendar management',
    purpose: 'scheduling automation and meeting coordination',
  },
  {
    key: 'facebook-ads',
    name: 'Facebook Ads',
    description:
      'OAuth-based integration with Facebook Ads platform for lead generation and advertising campaigns',
    purpose: 'lead capture and campaign automation',
  },
  {
    key: 'google-gmail',
    name: 'Google Gmail',
    description:
      'OAuth-based integration with Google Gmail for email automation and communication workflows',
    purpose: 'email sending and inbox management',
  },
  {
    key: 'google-sheets',
    name: 'Google Sheets',
    description:
      'OAuth-based integration with Google Sheets for spreadsheet data synchronization and automation',
    purpose: 'spreadsheet data management',
  },
  {
    key: 'linkedin-ads',
    name: 'LinkedIn Ads',
    description:
      'OAuth-based integration with LinkedIn Ads platform for B2B lead generation and advertising',
    purpose: 'professional lead capture and campaign automation',
  },
  {
    key: 'notion',
    name: 'Notion',
    description:
      'OAuth-based integration with Notion workspace for knowledge management and collaboration',
    purpose: 'page creation and database synchronization',
  },
  {
    key: 'qonto',
    name: 'Qonto',
    description: 'OAuth-based integration with Qonto banking platform for financial automation',
    purpose: 'invoice generation and client management',
  },
]

function replaceServiceReferences(content: string, service: (typeof SERVICES)[0]): string {
  return content
    .replace(/airtable/g, service.key)
    .replace(/Airtable/g, service.name)
    .replace(/AIRTABLE/g, service.key.toUpperCase().replace(/-/g, '_'))
}

function updateTypeSchema(service: (typeof SERVICES)[0]): string {
  return `{
  "$id": "type.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "${service.name} Connection Type",
  "description": "Connection type discriminator for ${service.name} integration",
  "const": "${service.key}",
  "examples": ["${service.key}"]
}
`
}

function updateClientIdSchema(service: (typeof SERVICES)[0]): string {
  return `{
  "$id": "client-id.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OAuth Client ID",
  "description": "OAuth 2.0 client identifier obtained from ${service.name} developer console",
  "type": "string",
  "minLength": 1,
  "examples": ["${service.key}_client_xyz789"]
}
`
}

function updateClientSecretSchema(service: (typeof SERVICES)[0]): string {
  return `{
  "$id": "client-secret.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OAuth Client Secret",
  "description": "OAuth 2.0 client secret for secure authentication flow with ${service.name}",
  "type": "string",
  "minLength": 1,
  "examples": ["secret_${service.key}_abc123"]
}
`
}

function updateNameSchema(service: (typeof SERVICES)[0]): string {
  return `{
  "$id": "name.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Connection Name",
  "description": "Human-readable name for the connection, displayed in UI and connection lists",
  "type": "string",
  "minLength": 1,
  "maxLength": 100,
  "examples": [
    "My ${service.name} Workspace",
    "Production Database",
    "Marketing Team ${service.name}"
  ]
}
`
}

function updateMainSchema(service: (typeof SERVICES)[0]): string {
  const specIdPrefix = `CONN-${service.key.toUpperCase().replace(/-/g, '_')}`
  return `{
  "$id": "${service.key}-connection.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "${service.name} Connection",
  "description": "${service.description}",
  "type": "object",
  "properties": {
    "type": {
      "$ref": "./type/type.schema.json"
    },
    "id": {
      "$ref": "./id/id.schema.json"
    },
    "name": {
      "$ref": "./name/name.schema.json"
    },
    "clientId": {
      "$ref": "./client-id/client-id.schema.json"
    },
    "clientSecret": {
      "$ref": "./client-secret/client-secret.schema.json"
    }
  },
  "required": ["type", "id", "name", "clientId", "clientSecret"],
  "additionalProperties": false,
  "examples": [
    {
      "type": "${service.key}",
      "id": 1,
      "name": "My ${service.name} Workspace",
      "clientId": "${service.key}_client_xyz789",
      "clientSecret": "secret_${service.key}_abc123"
    }
  ],
  "specs": [
    {
      "id": "${specIdPrefix}-001",
      "title": "Create ${service.name} connection with valid OAuth credentials",
      "given": "valid ${service.name} OAuth client ID and secret from ${service.name} developer console",
      "when": "user creates a new ${service.name} connection",
      "then": "connection is created successfully and OAuth flow can be initiated"
    },
    {
      "id": "${specIdPrefix}-002",
      "title": "Reject ${service.name} connection with invalid credentials",
      "given": "invalid or expired OAuth credentials",
      "when": "user attempts to create ${service.name} connection",
      "then": "system returns validation error indicating credential issue"
    },
    {
      "id": "${specIdPrefix}-003",
      "title": "Update ${service.name} connection name",
      "given": "existing ${service.name} connection",
      "when": "user updates connection name to a valid unique value",
      "then": "connection name is updated successfully"
    }
  ]
}
`
}

// Copy structure for each service
for (const service of SERVICES) {
  const serviceDir = join(BASE_DIR, `${service.key}-connection`)

  console.log(`Creating schemas for ${service.name}...`)

  // Copy id schema (just reference to common)
  const idSchemaPath = join(serviceDir, 'id', 'id.schema.json')
  const idSchema = readFileSync(join(BASE_DIR, 'airtable-connection/id/id.schema.json'), 'utf-8')
  writeFileSync(idSchemaPath, idSchema)

  // Copy and update name schema
  const nameSchemaPath = join(serviceDir, 'name', 'name.schema.json')
  writeFileSync(nameSchemaPath, updateNameSchema(service))

  // Update type schema
  const typeSchemaPath = join(serviceDir, 'type', 'type.schema.json')
  writeFileSync(typeSchemaPath, updateTypeSchema(service))

  // Update client-id schema
  const clientIdSchemaPath = join(serviceDir, 'client-id', 'client-id.schema.json')
  writeFileSync(clientIdSchemaPath, updateClientIdSchema(service))

  // Update client-secret schema
  const clientSecretSchemaPath = join(serviceDir, 'client-secret', 'client-secret.schema.json')
  writeFileSync(clientSecretSchemaPath, updateClientSecretSchema(service))

  // Update main connection schema
  const mainSchemaPath = join(serviceDir, `${service.key}-connection.schema.json`)
  writeFileSync(mainSchemaPath, updateMainSchema(service))

  // Copy READMEs with replacements
  const idReadmePath = join(serviceDir, 'id', 'README.md')
  const idReadme = readFileSync(join(BASE_DIR, 'airtable-connection/id/README.md'), 'utf-8')
  writeFileSync(idReadmePath, idReadme)

  const nameReadmePath = join(serviceDir, 'name', 'README.md')
  const nameReadme = readFileSync(join(BASE_DIR, 'airtable-connection/name/README.md'), 'utf-8')
  writeFileSync(nameReadmePath, replaceServiceReferences(nameReadme, service))

  const typeReadmePath = join(serviceDir, 'type', 'README.md')
  const typeReadme = readFileSync(join(BASE_DIR, 'airtable-connection/type/README.md'), 'utf-8')
  writeFileSync(typeReadmePath, replaceServiceReferences(typeReadme, service))

  const clientIdReadmePath = join(serviceDir, 'client-id', 'README.md')
  const clientIdReadme = readFileSync(
    join(BASE_DIR, 'airtable-connection/client-id/README.md'),
    'utf-8'
  )
  writeFileSync(clientIdReadmePath, replaceServiceReferences(clientIdReadme, service))

  const clientSecretReadmePath = join(serviceDir, 'client-secret', 'README.md')
  const clientSecretReadme = readFileSync(
    join(BASE_DIR, 'airtable-connection/client-secret/README.md'),
    'utf-8'
  )
  writeFileSync(clientSecretReadmePath, replaceServiceReferences(clientSecretReadme, service))

  const mainReadmePath = join(serviceDir, 'README.md')
  const mainReadme = readFileSync(join(BASE_DIR, 'airtable-connection/README.md'), 'utf-8')
  writeFileSync(mainReadmePath, replaceServiceReferences(mainReadme, service))

  console.log(`✅ ${service.name} schemas created`)
}

console.log('\n✅ All connection schemas created successfully!')
