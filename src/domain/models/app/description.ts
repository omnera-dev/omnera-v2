import { Schema } from 'effect'

/**
 * DescriptionSchema defines validation rules for application descriptions.
 *
 * Application descriptions must be single-line strings:
 * - No line breaks allowed (\n, \r, or \r\n)
 * - No maximum length restriction
 * - Can contain any characters except line breaks
 * - Empty strings are allowed
 * - Unicode characters and emojis are supported
 * - Special characters, spaces, and tabs are allowed
 *
 * @example
 * ```typescript
 * // Valid descriptions
 * const desc1 = 'A simple application'
 * const desc2 = 'My app - with special characters!@#$%'
 * const desc3 = 'Très bien! 你好 🎉'
 * const desc4 = ''
 *
 * // Invalid descriptions (contain line breaks)
 * const invalid1 = 'Multi\nline'          // ❌ Contains \n
 * const invalid2 = 'Windows\r\nbreak'     // ❌ Contains \r\n
 * const invalid3 = 'Mac\rbreak'           // ❌ Contains \r
 *
 * // Validate description
 * const validated = Schema.decodeUnknownSync(DescriptionSchema)(desc1)
 * ```
 */
export const DescriptionSchema = Schema.String.pipe(
  Schema.pattern(/^[^\r\n]*$/, {
    message: () => 'Description must be a single line (line breaks are not allowed)',
  }),
  Schema.annotations({
    title: 'Application Description',
    description: 'A single-line description of the application (line breaks not allowed)',
    examples: [
      'A simple application',
      'My app - with special characters!@#$%',
      'Très bien! 你好 🎉',
      'Full-featured e-commerce platform with cart, checkout & payment processing',
    ],
  })
)

/**
 * TypeScript type inferred from DescriptionSchema.
 *
 * Use this type for type-safe access to validated description strings.
 *
 * @example
 * ```typescript
 * const description: Description = 'A simple application'
 * ```
 */
export type Description = Schema.Schema.Type<typeof DescriptionSchema>

/**
 * Encoded type of DescriptionSchema (what goes in).
 *
 * In this case, it's the same as Description since we don't use transformations.
 */
export type DescriptionEncoded = Schema.Schema.Encoded<typeof DescriptionSchema>
