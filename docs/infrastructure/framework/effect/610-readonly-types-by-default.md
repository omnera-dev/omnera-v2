## Readonly Types by Default

It's important to note that by default, most constructors exported by
`effect/Schema` return `readonly` types.

**Example** (Readonly Types in a Schema)

For instance, in the `Person` schema below:

```ts twoslash
import { Schema } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})
```

the resulting inferred `Type` would be:

```ts showLineNumbers=false "readonly"
{
  readonly name: string;
  readonly age: number;
}
```
