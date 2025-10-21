/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync, rmdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const SPECS_DIR = join(process.cwd(), 'specs', 'app', 'automations')

interface Spec {
  id: string
  title?: string
  given: string
  when: string
  then: string
}

// Ensure directory exists
function ensureDir(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

// Write JSON file with proper formatting
function writeJson(path: string, data: unknown): void {
  ensureDir(dirname(path))
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

// Read and parse JSON file
function readJson(path: string): Record<string, unknown> {
  const content = readFileSync(path, 'utf-8')
  return JSON.parse(content) as Record<string, unknown>
}

console.log('🚀 Starting automations schema refactoring...\n')

// Step 1: Read the main automations schema
console.log('📖 Reading automations.schema.json...')
const automationsPath = join(SPECS_DIR, 'automations.schema.json')
const automationsSchema = readJson(automationsPath)

const definitions = (automationsSchema.definitions as Record<string, unknown>) || {}
const automation = definitions.automation as Record<string, unknown>
const automationProps = (automation?.properties as Record<string, unknown>) || {}
const allSpecs = (automationsSchema.specs as Spec[]) || []

console.log(`   Found ${allSpecs.length} specs to distribute\n`)

// Step 2: Extract and create common/filter-condition.schema.json
console.log('📝 Creating common/filter-condition.schema.json...')
const filterCondition = definitions.filter_condition as Record<string, unknown>
const filterConditionSpecs = allSpecs.filter((s) =>
  s.id.match(
    /SPEC-(023|024|025|026|027|028|029|030|031|032|033|034|035|036|037|038|039|040|041|042|043)/
  )
)

writeJson(join(SPECS_DIR, 'common', 'filter-condition.schema.json'), {
  $id: 'filter-condition.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...filterCondition,
  specs: filterConditionSpecs,
})

console.log(`   Created with ${filterConditionSpecs.length} specs\n`)

// Step 3: Extract and create common/json-schema.schema.json
console.log('📝 Creating common/json-schema.schema.json...')
const jsonSchema = definitions.json_schema as Record<string, unknown>
const jsonSchemaSpecs = allSpecs.filter(
  (s) => parseInt(s.id.replace('SPEC-', '')) >= 44 && parseInt(s.id.replace('SPEC-', '')) <= 90
)

writeJson(join(SPECS_DIR, 'common', 'json-schema.schema.json'), {
  $id: 'json-schema.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...jsonSchema,
  specs: jsonSchemaSpecs,
})

console.log(`   Created with ${jsonSchemaSpecs.length} specs\n`)

// Step 4: Create property schemas
console.log('📝 Creating property schemas...\n')

// id.schema.json
const idSpecs = allSpecs.filter((s) => s.id.match(/SPEC-(009|010|011)/))
writeJson(join(SPECS_DIR, 'id', 'id.schema.json'), {
  $id: 'id.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  $ref: '../common/definitions.schema.json#/definitions/id',
  title: 'Automation ID',
  examples: [1, 2, 100],
  specs: idSpecs,
})
console.log(`   id/id.schema.json (${idSpecs.length} specs)`)

// name.schema.json
const nameSpecs = allSpecs.filter((s) => s.id.match(/SPEC-(012|013)/))
const nameProp = automationProps.name as Record<string, unknown>
writeJson(join(SPECS_DIR, 'name', 'name.schema.json'), {
  $id: 'name.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...nameProp,
  specs: nameSpecs,
})
console.log(`   name/name.schema.json (${nameSpecs.length} specs)`)

// description.schema.json
const descSpecs = allSpecs.filter((s) => s.id.match(/SPEC-(014|015)/))
const descProp = automationProps.description as Record<string, unknown>
writeJson(join(SPECS_DIR, 'description', 'description.schema.json'), {
  $id: 'description.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...descProp,
  specs: descSpecs,
})
console.log(`   description/description.schema.json (${descSpecs.length} specs)`)

// edit-url.schema.json
const editUrlSpecs = allSpecs.filter((s) => s.id.match(/SPEC-(016|017|018)/))
const editUrlProp = automationProps.editUrl as Record<string, unknown>
writeJson(join(SPECS_DIR, 'edit-url', 'edit-url.schema.json'), {
  $id: 'edit-url.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...editUrlProp,
  specs: editUrlSpecs,
})
console.log(`   edit-url/edit-url.schema.json (${editUrlSpecs.length} specs)`)

// trigger.schema.json
const triggerSpecs = allSpecs.filter((s) => s.id.match(/SPEC-(019|020)/))
const triggerDef = definitions.automation_trigger as Record<string, unknown>
const triggerAnyOf = (triggerDef.anyOf as Array<Record<string, string>>).map((ref) => {
  // ./triggers/http-post-trigger.schema.json → ../trigger-types/http-post/http-post-trigger.schema.json
  const refPath = ref.$ref
  const fileName = refPath.replace('./triggers/', '')
  const dirName = fileName.replace('-trigger.schema.json', '').replace('.schema.json', '')
  return { $ref: `../trigger-types/${dirName}/${fileName}` }
})
writeJson(join(SPECS_DIR, 'trigger', 'trigger.schema.json'), {
  $id: 'trigger.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...triggerDef,
  anyOf: triggerAnyOf,
  specs: triggerSpecs,
})
console.log(`   trigger/trigger.schema.json (${triggerSpecs.length} specs)`)

// actions.schema.json
const actionsSpecs = allSpecs.filter((s) => s.id.match(/SPEC-(021|022)/))
const actionDef = definitions.automation_action as Record<string, unknown>
const actionAnyOf = (actionDef.anyOf as Array<Record<string, string>>).map((ref) => {
  // ./actions/http-post-action.schema.json → ../action-types/http-post/http-post-action.schema.json
  const refPath = ref.$ref
  const fileName = refPath.replace('./actions/', '')
  const dirName = fileName.replace('-action.schema.json', '').replace('.schema.json', '')
  return { $ref: `../action-types/${dirName}/${fileName}` }
})
writeJson(join(SPECS_DIR, 'actions', 'actions.schema.json'), {
  $id: 'actions.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...actionDef,
  anyOf: actionAnyOf,
  specs: actionsSpecs,
})
console.log(`   actions/actions.schema.json (${actionsSpecs.length} specs)\n`)

// Step 5: Restructure trigger schemas
console.log('📁 Restructuring trigger schemas...\n')

const triggerFiles = [
  'http-post-trigger',
  'http-get-trigger',
  'database-record-created-trigger',
  'database-record-updated-trigger',
  'schedule-cron-time-trigger',
  'calendly-invite-created-trigger',
  'airtable-record-created-trigger',
  'linkedin-ads-new-lead-gen-form-response-trigger',
  'facebook-ads-new-lead-trigger',
]

for (const triggerName of triggerFiles) {
  const oldPath = join(SPECS_DIR, 'triggers', `${triggerName}.schema.json`)
  const dirName = triggerName.replace('-trigger', '')
  const newDir = join(SPECS_DIR, 'trigger-types', dirName)
  const newPath = join(newDir, `${triggerName}.schema.json`)

  if (existsSync(oldPath)) {
    ensureDir(newDir)
    const triggerSchema = readJson(oldPath)

    // Add $id
    triggerSchema.$id = `${triggerName}.schema.json`

    // Update any internal $refs pointing to automations.schema.json definitions
    const schemaStr = JSON.stringify(triggerSchema)
    const updatedStr = schemaStr
      .replace(
        /"\.\.\/automations\.schema\.json#\/definitions\/filter_condition"/g,
        '"../../common/filter-condition.schema.json"'
      )
      .replace(
        /"\.\.\/automations\.schema\.json#\/definitions\/json_schema"/g,
        '"../../common/json-schema.schema.json"'
      )

    const updatedSchema = JSON.parse(updatedStr) as Record<string, unknown>
    writeJson(newPath, updatedSchema)
    console.log(`   ✓ ${dirName}/${triggerName}.schema.json`)
  }
}

// Step 6: Restructure action schemas
console.log('\n📁 Restructuring action schemas...\n')

const actionFiles = [
  'http-get-action',
  'http-post-action',
  'http-response-action',
  'code-run-typescript-action',
  'code-run-javascript-action',
  'filter-only-continue-if-action',
  'filter-split-into-paths-action',
  'database-create-record-action',
  'calendly-list-webhook-subscriptions-action',
  'calendly-get-event-type-action',
  'airtable-list-webhook-payloads-action',
  'google-sheets-append-values-action',
  'google-gmail-send-email-action',
  'linkedin-ads-create-lead-notification-subscription-action',
  'linkedin-ads-list-lead-notification-subscriptions-action',
  'linkedin-ads-get-lead-form-response-action',
  'facebook-ads-list-app-subscriptions-action',
  'facebook-ads-get-leadgen-action',
  'notion-create-page-action',
  'notion-get-page-action',
  'notion-update-page-action',
  'notion-delete-page-action',
  'notion-list-pages-action',
  'notion-search-pages-action',
  'qonto-create-client-action',
  'qonto-create-invoice-action',
]

for (const actionName of actionFiles) {
  const oldPath = join(SPECS_DIR, 'actions', `${actionName}.schema.json`)
  const dirName = actionName.replace('-action', '')
  const newDir = join(SPECS_DIR, 'action-types', dirName)
  const newPath = join(newDir, `${actionName}.schema.json`)

  if (existsSync(oldPath)) {
    ensureDir(newDir)
    const actionSchema = readJson(oldPath)

    // Add $id
    actionSchema.$id = `${actionName}.schema.json`

    // Update any internal $refs pointing to automations.schema.json definitions
    const schemaStr = JSON.stringify(actionSchema)
    const updatedStr = schemaStr
      .replace(
        /"\.\.\/automations\.schema\.json#\/definitions\/filter_condition"/g,
        '"../../common/filter-condition.schema.json"'
      )
      .replace(
        /"\.\.\/automations\.schema\.json#\/definitions\/json_schema"/g,
        '"../../common/json-schema.schema.json"'
      )

    writeJson(newPath, JSON.parse(updatedStr))
    console.log(`   ✓ ${dirName}/${actionName}.schema.json`)
  }
}

// Step 7: Create nested property directories for complex types
console.log('\n📁 Creating nested property directories...\n')

// http-post trigger params
const httpPostTriggerDir = join(SPECS_DIR, 'trigger-types', 'http-post', 'params')
ensureDir(join(httpPostTriggerDir, 'path'))
ensureDir(join(httpPostTriggerDir, 'respond-immediately'))
ensureDir(join(httpPostTriggerDir, 'request-body'))
console.log('   ✓ trigger-types/http-post/params/ (path, respond-immediately, request-body)')

// http-post action params
const httpPostActionDir = join(SPECS_DIR, 'action-types', 'http-post', 'params')
ensureDir(join(httpPostActionDir, 'url'))
ensureDir(join(httpPostActionDir, 'headers'))
ensureDir(join(httpPostActionDir, 'body'))
console.log('   ✓ action-types/http-post/params/ (url, headers, body)')

// filter-split-into-paths conditions
const filterSplitDir = join(SPECS_DIR, 'action-types', 'filter-split-into-paths', 'conditions')
ensureDir(filterSplitDir)
console.log('   ✓ action-types/filter-split-into-paths/conditions/')

// Step 8: Update main automations.schema.json
console.log('\n📝 Updating main automations.schema.json...\n')

const arraySpecs = allSpecs.filter(
  (s) => parseInt(s.id.replace('SPEC-', '')) >= 1 && parseInt(s.id.replace('SPEC-', '')) <= 8
)

const updatedAutomations = {
  $schema: automationsSchema.$schema,
  title: automationsSchema.title,
  description: automationsSchema.description,
  default: automationsSchema.default,
  type: automationsSchema.type,
  items: {
    type: 'object',
    properties: {
      id: { $ref: './id/id.schema.json' },
      name: { $ref: './name/name.schema.json' },
      description: { $ref: './description/description.schema.json' },
      editUrl: { $ref: './edit-url/edit-url.schema.json' },
      trigger: { $ref: './trigger/trigger.schema.json' },
      actions: {
        description: 'Sequence of actions to execute when triggered',
        title: 'Actions',
        default: [],
        type: 'array',
        items: { $ref: './actions/actions.schema.json' },
      },
    },
    required: ['id', 'name', 'trigger', 'actions'],
    additionalProperties: false,
  },
  specs: arraySpecs,
}

writeJson(automationsPath, updatedAutomations)
console.log(`   Updated with ${arraySpecs.length} array-level specs`)

// Step 9: Clean up old directories
console.log('\n🧹 Cleaning up old directories...\n')

try {
  const oldActionsDir = join(SPECS_DIR, 'actions')
  if (existsSync(oldActionsDir)) {
    // Remove old action schema files
    for (const actionName of actionFiles) {
      const oldFile = join(oldActionsDir, `${actionName}.schema.json`)
      if (existsSync(oldFile)) {
        // Already moved, this cleanup step would be done after verification
      }
    }
    console.log('   ✓ Old actions/ directory ready for removal (will keep for safety)')
  }

  const oldTriggersDir = join(SPECS_DIR, 'triggers')
  if (existsSync(oldTriggersDir)) {
    console.log('   ✓ Old triggers/ directory ready for removal (will keep for safety)')
  }
} catch (_error) {
  console.warn('   ⚠️  Could not remove old directories (may need manual cleanup)')
}

// Summary
console.log('\n📊 Refactoring Summary:\n')
console.log(`   ✅ Created 2 common schemas (filter-condition, json-schema)`)
console.log(`   ✅ Created 6 property schemas (id, name, description, edit-url, trigger, actions)`)
console.log(`   ✅ Restructured ${triggerFiles.length} trigger schemas`)
console.log(`   ✅ Restructured ${actionFiles.length} action schemas`)
console.log(`   ✅ Created nested property directories for complex types`)
console.log(`   ✅ Updated main automations.schema.json`)
console.log(`   ✅ Distributed ${allSpecs.length} specs across files`)
console.log('\n✨ Refactoring complete! Run validation next.\n')
