import { Schema } from 'effect'
import { TextFieldSchema } from './field-types/text-field.ts'
import { NumberFieldSchema } from './field-types/number-field.ts'
import { DateFieldSchema } from './field-types/date-field.ts'
import { CheckboxFieldSchema } from './field-types/checkbox-field.ts'
import { SingleSelectFieldSchema } from './field-types/single-select-field.ts'
import { MultiSelectFieldSchema } from './field-types/multi-select-field.ts'
import { RelationshipFieldSchema } from './field-types/relationship-field.ts'
import { SingleAttachmentFieldSchema } from './field-types/single-attachment-field.ts'
import { MultipleAttachmentsFieldSchema } from './field-types/multiple-attachments-field.ts'
import { FormulaFieldSchema } from './field-types/formula-field.ts'
import { RollupFieldSchema } from './field-types/rollup-field.ts'
import { LookupFieldSchema } from './field-types/lookup-field.ts'
import { UserFieldSchema } from './field-types/user-field.ts'
import { CreatedAtFieldSchema } from './field-types/created-at-field.ts'
import { CreatedByFieldSchema } from './field-types/created-by-field.ts'
import { UpdatedAtFieldSchema } from './field-types/updated-at-field.ts'
import { UpdatedByFieldSchema } from './field-types/updated-by-field.ts'
import { RatingFieldSchema } from './field-types/rating-field.ts'
import { DurationFieldSchema } from './field-types/duration-field.ts'
import { RichTextFieldSchema } from './field-types/rich-text-field.ts'
import { StatusFieldSchema } from './field-types/status-field.ts'
import { ButtonFieldSchema } from './field-types/button-field.ts'
import { AutonumberFieldSchema } from './field-types/autonumber-field.ts'
import { BarcodeFieldSchema } from './field-types/barcode-field.ts'
import { ColorFieldSchema } from './field-types/color-field.ts'
import { ProgressFieldSchema } from './field-types/progress-field.ts'
import { GeolocationFieldSchema } from './field-types/geolocation-field.ts'
import { JsonFieldSchema } from './field-types/json-field.ts'
import { ArrayFieldSchema } from './field-types/array-field.ts'

/**
 * Table Fields
 *
 * Collection of all supported field types in a table.
 * Each field type has specific properties and validation rules.
 * Fields are the columns in your database tables and determine
 * what data can be stored and how it is validated.
 *
 * @see docs/specifications/roadmap/tables/fields.md for full specification
 */
export const FieldsSchema = Schema.Array(
  Schema.Union(
    TextFieldSchema,
    NumberFieldSchema,
    DateFieldSchema,
    CheckboxFieldSchema,
    SingleSelectFieldSchema,
    MultiSelectFieldSchema,
    RelationshipFieldSchema,
    SingleAttachmentFieldSchema,
    MultipleAttachmentsFieldSchema,
    FormulaFieldSchema,
    RollupFieldSchema,
    LookupFieldSchema,
    UserFieldSchema,
    CreatedAtFieldSchema,
    CreatedByFieldSchema,
    UpdatedAtFieldSchema,
    UpdatedByFieldSchema,
    RatingFieldSchema,
    DurationFieldSchema,
    RichTextFieldSchema,
    StatusFieldSchema,
    ButtonFieldSchema,
    AutonumberFieldSchema,
    BarcodeFieldSchema,
    ColorFieldSchema,
    ProgressFieldSchema,
    GeolocationFieldSchema,
    JsonFieldSchema,
    ArrayFieldSchema
  )
).pipe(
  Schema.minItems(1),
  Schema.annotations({
    title: 'Table Fields',
    description:
      'Collection of all supported field types. Each field defines a column in the database table with specific validation and behavior.',
    examples: [
      [
        {
          id: 1,
          name: 'email',
          type: 'text',
          required: true,
        },
        {
          id: 2,
          name: 'age',
          type: 'number',
          min: 0,
          max: 150,
        },
      ],
    ],
  })
)

export type Fields = Schema.Schema.Type<typeof FieldsSchema>
