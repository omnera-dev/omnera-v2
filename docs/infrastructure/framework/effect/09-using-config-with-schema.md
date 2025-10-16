## Using Config with Schema

You can define and decode configuration values using a schema.

**Example** (Decoding a Configuration Value)

```ts twoslash
import { Effect, Schema } from 'effect'

// Define a config that expects a string with at least 4 characters
const myConfig = Schema.Config('Foo', Schema.String.pipe(Schema.minLength(4)))
```

For more information, see the [Schema.Config](/docs/schema/effect-data-types/#config) documentation.
