## Tagged Class variants

You can also create classes that extend [TaggedClass](/docs/data-types/data/#taggedclass) and [TaggedError](/docs/data-types/data/#taggederror) from the `effect/Data` module.

**Example** (Creating Tagged Classes and Errors)

```ts twoslash
import { Schema } from 'effect'

// Define a tagged class with a "name" field
class TaggedPerson extends Schema.TaggedClass<TaggedPerson>()('TaggedPerson', {
  name: Schema.String,
}) {}

// Define a tagged error with a "status" field
class HttpError extends Schema.TaggedError<HttpError>()('HttpError', {
  status: Schema.Number,
}) {}

const joe = new TaggedPerson({ name: 'Joe' })
console.log(joe._tag)
// Output: "TaggedPerson"

const error = new HttpError({ status: 404 })
console.log(error._tag)
// Output: "HttpError"

console.log(error.stack) // access the stack trace
```
