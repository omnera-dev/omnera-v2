## Transformations and Arbitrary Generation

When generating arbitrary data, it is important to understand how transformations and filters are handled within a schema:

<Aside type="caution" title="Filters Ignored">
  Filters applied before the last transformation in the transformation
  chain are not considered during the generation of arbitrary data.
</Aside>

**Example** (Filters and Transformations)

```ts twoslash
import { Arbitrary, FastCheck, Schema } from 'effect'

// Schema with filters before the transformation
const schema1 = Schema.compose(Schema.NonEmptyString, Schema.Trim).pipe(Schema.maxLength(500))

// May produce empty strings due to ignored NonEmpty filter
console.log(FastCheck.sample(Arbitrary.make(schema1), 2))
/*
Example Output:
[ '', '"Ry' ]
*/

// Schema with filters applied after transformations
const schema2 = Schema.Trim.pipe(Schema.nonEmptyString(), Schema.maxLength(500))

// Adheres to all filters, avoiding empty strings
console.log(FastCheck.sample(Arbitrary.make(schema2), 2))
/*
Example Output:
[ ']H+MPXgZKz', 'SNS|waP~\\' ]
*/
```

**Explanation:**

- `schema1`: Takes into account `Schema.maxLength(500)` since it is applied after the `Schema.Trim` transformation, but ignores the `Schema.NonEmptyString` as it precedes the transformations.
- `schema2`: Adheres fully to all filters because they are correctly sequenced after transformations, preventing the generation of undesired data.

### Best Practices

To ensure consistent and valid arbitrary data generation, follow these guidelines:

1. **Apply Filters First**: Define filters for the initial type (`I`).
2. **Apply Transformations**: Add transformations to convert the data.
3. **Apply Final Filters**: Use filters for the transformed type (`A`).

This setup ensures that each stage of data processing is precise and well-defined.

**Example** (Avoid Mixed Filters and Transformations)

Avoid haphazard combinations of transformations and filters:

```ts twoslash
import { Schema } from 'effect'

// Less optimal approach: Mixing transformations and filters
const problematic = Schema.compose(Schema.Lowercase, Schema.Trim)
```

Prefer a structured approach by separating transformation steps from filter applications:

**Example** (Preferred Structured Approach)

```ts twoslash
import { Schema } from 'effect'

// Recommended: Separate transformations and filters
const improved = Schema.transform(
  Schema.String,
  Schema.String.pipe(Schema.trimmed(), Schema.lowercased()),
  {
    strict: true,
    decode: (s) => s.trim().toLowerCase(),
    encode: (s) => s,
  }
)
```
