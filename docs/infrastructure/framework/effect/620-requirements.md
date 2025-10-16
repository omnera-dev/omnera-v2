## Requirements

- TypeScript 5.4 or newer.
- The `strict` flag enabled in your `tsconfig.json` file.
- (Optional) The `exactOptionalPropertyTypes` flag enabled in your `tsconfig.json` file.

```json showLineNumbers=false
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true // optional
  }
}
```

### The exactOptionalPropertyTypes Option

The `effect/Schema` module takes advantage of the `exactOptionalPropertyTypes` option of `tsconfig.json`. This option affects how optional properties are typed (to learn more about this option, you can refer to the official [TypeScript documentation](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)).

**Example** (With `exactOptionalPropertyTypes` Enabled)

```ts twoslash
import { Schema } from "effect"

const Person = Schema.Struct({
  name: Schema.optionalWith(Schema.NonEmptyString, { exact: true })
})

type Type = Schema.Schema.Type<typeof Person>
/*
type Type = {
    readonly name?: string;
}
*/

// @errors: 2379
Schema.decodeSync(Person)({ name: undefined })
```

Here, notice that the type of `name` is "exact" (`string`), which means the type checker will catch any attempt to assign an invalid value (like `undefined`).

**Example** (With `exactOptionalPropertyTypes` Disabled)

If, for some reason, you can't enable the `exactOptionalPropertyTypes` option (perhaps due to conflicts with other third-party libraries), you can still use `effect/Schema`. However, there will be a mismatch between the types and the runtime behavior:

```ts
import { Schema } from "effect"

const Person = Schema.Struct({
  name: Schema.optionalWith(Schema.NonEmptyString, { exact: true })
})

type Type = Schema.Schema.Type<typeof Person>
/*
type Type = {
    readonly name?: string | undefined;
}
*/

// No type error, but a decoding failure occurs
Schema.decodeSync(Person)({ name: undefined })
/*
throws:
ParseError: { readonly name?: NonEmptyString }
└─ ["name"]
   └─ NonEmptyString
      └─ From side refinement failure
         └─ Expected string, actual undefined
*/
```

In this case, the type of `name` is widened to `string | undefined`, which means the type checker won't catch the invalid value (`undefined`). However, during decoding, you'll encounter an error, indicating that `undefined` is not allowed.
