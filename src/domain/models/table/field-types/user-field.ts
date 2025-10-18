import { Schema } from 'effect'
import { IdSchema } from '@/domain/models/table/id.ts'

/**
 * User Field
 *
 * Reference field that links to users from the authentication system.
 * Stores user IDs and can be used for assignments, ownership, or collaboration.
 * Supports single or multiple user selection via allowMultiple flag.
 *
 * @example
 * ```typescript
 * const field = {
 *   id: 1,
 *   name: 'assigned_to',
 *   type: 'user',
 *   required: true,
 *   allowMultiple: false
 * }
 * ```
 */
export const UserFieldSchema = Schema.Struct({
  id: IdSchema,
  name: Schema.Unknown,
  required: Schema.optional(Schema.Boolean),
  indexed: Schema.optional(Schema.Boolean),
  type: Schema.String,
  allowMultiple: Schema.optional(Schema.Boolean),
}).pipe(
  Schema.annotations({
    title: 'User Field',
    description:
      'Reference field linking to users from authentication system. Supports single or multiple user selection.',
    examples: [
      {
        id: 1,
        name: 'assigned_to',
        type: 'user',
        required: true,
        allowMultiple: false,
      },
    ],
  })
)

export type UserField = Schema.Schema.Type<typeof UserFieldSchema>
