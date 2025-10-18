/**
 * JSON Schema to Effect Schema code generator
 */

import type { EffectSchemaBlueprint, JSONSchemaProperty } from '../types/roadmap.ts'

/**
 * Convert property path to valid TypeScript identifier
 * Example: "pages.form-page.inputs.text-input" → "PagesFormPageInputsTextInput"
 */
function toTypeScriptIdentifier(propertyPath: string): string {
  return propertyPath
    .split('.')
    .map((part) =>
      part
        .split(/[-_]/)
        .map((word) => capitalize(word))
        .join('')
    )
    .join('')
}

/**
 * Convert property path to kebab-case filename
 * Example: "pages.form-page.inputs.text-input" → "pages-form-page-inputs-text-input"
 */
function toKebabCase(propertyPath: string): string {
  return propertyPath
    .split('.')
    .map((part) => part.toLowerCase())
    .join('-')
}

/**
 * Generate Effect Schema code from JSON Schema
 */
export function generateEffectSchema(
  propertyName: string,
  schema: JSONSchemaProperty,
  definitions?: Record<string, JSONSchemaProperty>
): EffectSchemaBlueprint {
  const imports = new Set<string>(['Schema'])
  const exports = new Set<string>()
  const sanitizedName = toTypeScriptIdentifier(propertyName)
  const fileName = toKebabCase(propertyName)

  const code = generateSchemaCode(propertyName, schema, definitions, imports, exports, 0)

  return {
    propertyName,
    sanitizedName,
    fileName,
    code,
    imports: Array.from(imports),
    exports: Array.from(exports),
  }
}

/**
 * Generate Effect Schema code recursively
 */
function generateSchemaCode(
  name: string,
  schema: JSONSchemaProperty,
  definitions: Record<string, JSONSchemaProperty> | undefined,
  imports: Set<string>,
  exports: Set<string>,
  depth: number
): string {
  const indent = '  '.repeat(depth)
  const sanitizedName = toTypeScriptIdentifier(name)
  const schemaName = sanitizedName + 'Schema'

  let code = ''

  // Add JSDoc if available
  if (schema.title || schema.description) {
    code += `${indent}/**\n`
    if (schema.title) {
      code += `${indent} * ${schema.title}\n`
    }
    if (schema.description) {
      code += `${indent} * \n`
      code += `${indent} * ${schema.description}\n`
    }
    if (schema.examples && schema.examples.length > 0) {
      code += `${indent} * \n`
      code += `${indent} * @example\n`
      code += `${indent} * \`\`\`typescript\n`
      code += `${indent} * ${JSON.stringify(schema.examples[0], null, 2).split('\n').join(`\n${indent} * `)}\n`
      code += `${indent} * \`\`\`\n`
    }
    code += `${indent} */\n`
  }

  code += `${indent}export const ${schemaName} = `

  // Handle different schema types
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()!
    const refSchema = definitions?.[refName]
    if (refSchema) {
      code += generateSchemaExpression(refSchema, imports, depth)
    } else {
      code += `${capitalize(refName)}Schema`
    }
  } else if (schema.anyOf) {
    code += generateUnionSchema(schema.anyOf, definitions, imports, exports, depth)
  } else if (schema.oneOf) {
    code += generateUnionSchema(schema.oneOf, definitions, imports, exports, depth)
  } else if (schema.type === 'object') {
    code += generateObjectSchema(schema, definitions, imports, exports, depth)
  } else if (schema.type === 'array') {
    code += generateArraySchema(schema, definitions, imports, exports, depth)
  } else {
    code += generatePrimitiveSchema(schema, imports, depth)
  }

  code += '\n\n'

  // Export type
  code += `${indent}export type ${sanitizedName} = Schema.Schema.Type<typeof ${schemaName}>\n`
  exports.add(schemaName)
  exports.add(sanitizedName)

  return code
}

/**
 * Generate schema expression (without export/type)
 */
function generateSchemaExpression(
  schema: JSONSchemaProperty,
  imports: Set<string>,
  depth: number
): string {
  const indent = '  '.repeat(depth + 1)

  // Handle anyOf/oneOf first (before checking type)
  if (schema.anyOf || schema.oneOf) {
    const variants = schema.anyOf || schema.oneOf || []
    const variantExprs = variants.map((variant) => {
      return generateSchemaExpression(variant, imports, depth + 1)
    })
    return `Schema.Union(\n${indent}  ${variantExprs.join(`,\n${indent}  `)}\n${indent})`
  }

  switch (schema.type) {
    case 'string': {
      return generateStringSchema(schema, imports, indent)
    }
    case 'number':
    case 'integer': {
      return generateNumberSchema(schema, imports, indent)
    }
    case 'boolean': {
      return `Schema.Boolean`
    }
    case 'array': {
      const itemsExpr = schema.items
        ? generateSchemaExpression(schema.items as JSONSchemaProperty, imports, depth)
        : 'Schema.Unknown'
      return `Schema.Array(${itemsExpr})`
    }
    case 'object': {
      return generateObjectSchemaExpression(schema, imports, depth)
    }
    default:
      if (schema.const !== undefined) {
        return `Schema.Literal(${JSON.stringify(schema.const)})`
      } else if (schema.enum) {
        const values = schema.enum.map((v) => JSON.stringify(v)).join(', ')
        return `Schema.Literal(${values})`
      }
  }

  return 'Schema.Unknown'
}

/**
 * Generate string schema with validations
 */
function generateStringSchema(
  schema: JSONSchemaProperty,
  _imports: Set<string>,
  indent: string
): string {
  const pipes: string[] = []

  if (schema.minLength !== undefined) {
    const msg =
      schema.minLength === 1
        ? 'This field is required'
        : `Minimum length is ${schema.minLength} characters`
    pipes.push(`Schema.minLength(${schema.minLength}, { message: () => '${msg}' })`)
  }

  if (schema.maxLength !== undefined) {
    pipes.push(
      `Schema.maxLength(${schema.maxLength}, { message: () => 'Maximum length is ${schema.maxLength} characters' })`
    )
  }

  if (schema.pattern) {
    const patternMsg = schema.description || 'Invalid format'
    pipes.push(
      `Schema.pattern(/${schema.pattern.replace(/\\/g, '\\\\')}/, {\n${indent}  message: () => '${patternMsg}'\n${indent}})`
    )
  }

  // Add annotations
  const annotations = buildAnnotations(schema, indent)
  if (annotations) {
    pipes.push(annotations)
  }

  if (pipes.length === 0) {
    return annotations ? `Schema.String.pipe(${annotations})` : 'Schema.String'
  }

  return `Schema.String.pipe(\n${indent}  ${pipes.join(`,\n${indent}  `)}\n${indent})`
}

/**
 * Generate number schema with validations
 */
function generateNumberSchema(
  schema: JSONSchemaProperty,
  _imports: Set<string>,
  indent: string
): string {
  const isInt = schema.type === 'integer'
  const base = isInt ? 'Schema.Int' : 'Schema.Number'
  const pipes: string[] = []

  if (schema.minimum !== undefined) {
    pipes.push(`Schema.greaterThanOrEqualTo(${schema.minimum})`)
  }

  if (schema.maximum !== undefined) {
    pipes.push(`Schema.lessThanOrEqualTo(${schema.maximum})`)
  }

  if (schema.exclusiveMinimum !== undefined) {
    const min =
      typeof schema.exclusiveMinimum === 'boolean' ? schema.minimum : schema.exclusiveMinimum
    pipes.push(`Schema.greaterThan(${min})`)
  }

  if (schema.exclusiveMaximum !== undefined) {
    const max =
      typeof schema.exclusiveMaximum === 'boolean' ? schema.maximum : schema.exclusiveMaximum
    pipes.push(`Schema.lessThan(${max})`)
  }

  const annotations = buildAnnotations(schema, indent)
  if (annotations) {
    pipes.push(annotations)
  }

  if (pipes.length === 0) {
    return base
  }

  return `${base}.pipe(\n${indent}  ${pipes.join(`,\n${indent}  `)}\n${indent})`
}

/**
 * Generate object schema
 */
function generateObjectSchema(
  schema: JSONSchemaProperty,
  _definitions: Record<string, JSONSchemaProperty> | undefined,
  imports: Set<string>,
  _exports: Set<string>,
  depth: number
): string {
  const indent = '  '.repeat(depth + 1)
  const properties = schema.properties || {}
  const required = schema.required || []

  let code = 'Schema.Struct({\n'

  for (const [propName, propSchema] of Object.entries(properties)) {
    const isRequired = required.includes(propName)
    const propExpr = generateSchemaExpression(propSchema, imports, depth + 1)

    if (isRequired) {
      code += `${indent}  ${propName}: ${propExpr},\n`
    } else {
      code += `${indent}  ${propName}: Schema.optional(${propExpr}),\n`
    }
  }

  code += `${indent}})`

  // Add annotations if available
  const annotations = buildAnnotations(schema, indent)
  if (annotations) {
    code += `.pipe(${annotations})`
  }

  return code
}

/**
 * Generate object schema expression (inline, no export)
 */
function generateObjectSchemaExpression(
  schema: JSONSchemaProperty,
  imports: Set<string>,
  depth: number
): string {
  const indent = '  '.repeat(depth + 1)
  const properties = schema.properties || {}
  const required = schema.required || []

  let code = 'Schema.Struct({\n'

  for (const [propName, propSchema] of Object.entries(properties)) {
    const isRequired = required.includes(propName)
    const propExpr = generateSchemaExpression(propSchema, imports, depth + 1)

    if (isRequired) {
      code += `${indent}  ${propName}: ${propExpr},\n`
    } else {
      code += `${indent}  ${propName}: Schema.optional(${propExpr}),\n`
    }
  }

  code += `${indent}})`
  return code
}

/**
 * Generate array schema
 */
function generateArraySchema(
  schema: JSONSchemaProperty,
  _definitions: Record<string, JSONSchemaProperty> | undefined,
  imports: Set<string>,
  _exports: Set<string>,
  depth: number
): string {
  const indent = '  '.repeat(depth + 1)
  const itemsExpr = schema.items
    ? generateSchemaExpression(schema.items as JSONSchemaProperty, imports, depth)
    : 'Schema.Unknown'

  const pipes: string[] = []

  if (schema.minItems !== undefined) {
    pipes.push(`Schema.minItems(${schema.minItems})`)
  }

  if (schema.maxItems !== undefined) {
    pipes.push(`Schema.maxItems(${schema.maxItems})`)
  }

  const annotations = buildAnnotations(schema, indent)
  if (annotations) {
    pipes.push(annotations)
  }

  let code = `Schema.Array(${itemsExpr})`

  if (pipes.length > 0) {
    code += `.pipe(\n${indent}  ${pipes.join(`,\n${indent}  `)}\n${indent})`
  }

  return code
}

/**
 * Generate primitive schema
 */
function generatePrimitiveSchema(
  schema: JSONSchemaProperty,
  imports: Set<string>,
  depth: number
): string {
  const indent = '  '.repeat(depth + 1)

  if (schema.const !== undefined) {
    const annotations = buildAnnotations(schema, indent)
    const literal = `Schema.Literal(${JSON.stringify(schema.const)})`
    return annotations ? `${literal}.pipe(${annotations})` : literal
  }

  if (schema.enum) {
    const values = schema.enum.map((v) => JSON.stringify(v)).join(', ')
    const annotations = buildAnnotations(schema, indent)
    const literal = `Schema.Literal(${values})`
    return annotations ? `${literal}.pipe(${annotations})` : literal
  }

  if (schema.type === 'string') {
    return generateStringSchema(schema, imports, indent)
  }

  if (schema.type === 'number' || schema.type === 'integer') {
    return generateNumberSchema(schema, imports, indent)
  }

  if (schema.type === 'boolean') {
    return 'Schema.Boolean'
  }

  return 'Schema.Unknown'
}

/**
 * Generate union schema (anyOf/oneOf)
 */
function generateUnionSchema(
  variants: JSONSchemaProperty[],
  _definitions: Record<string, JSONSchemaProperty> | undefined,
  imports: Set<string>,
  _exports: Set<string>,
  depth: number
): string {
  const indent = '  '.repeat(depth + 1)

  const variantExprs = variants.map((variant) => {
    return generateSchemaExpression(variant, imports, depth)
  })

  return `Schema.Union(\n${indent}  ${variantExprs.join(`,\n${indent}  `)}\n${indent})`
}

/**
 * Build annotations object
 */
function buildAnnotations(schema: JSONSchemaProperty, indent: string): string | null {
  const annotations: string[] = []

  if (schema.title) {
    annotations.push(`title: ${JSON.stringify(schema.title)}`)
  }

  if (schema.description) {
    annotations.push(`description: ${JSON.stringify(schema.description)}`)
  }

  if (schema.examples && schema.examples.length > 0) {
    annotations.push(`examples: ${JSON.stringify(schema.examples)}`)
  }

  if (annotations.length === 0) {
    return null
  }

  return `Schema.annotations({\n${indent}  ${annotations.join(`,\n${indent}  `)}\n${indent}})`
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
