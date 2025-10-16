## The Schema Type

A schema is an immutable value that describes the structure of your data, and it is represented by the `Schema` type.

Here is the general form of a `Schema`:

```text showLineNumbers=false
         ┌─── Type of the decoded value
         │        ┌─── Encoded type (input/output)
         │        │      ┌─── Requirements (context)
         ▼        ▼      ▼
Schema<Type, Encoded, Requirements>
```

The `Schema` type has three type parameters with the following meanings:

| Parameter        | Description                                                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Type**         | Represents the type of value that a schema can succeed with during decoding.                                                                                                                                                                                                                                  |
| **Encoded**      | Represents the type of value that a schema can succeed with during encoding. By default, it's equal to `Type` if not explicitly provided.                                                                                                                                                                     |
| **Requirements** | Similar to the [`Effect`](https://effect.website/docs/getting-started/the-effect-type) type, it represents the contextual data required by the schema to execute both decoding and encoding. If this type parameter is `never` (default if not explicitly provided), it means the schema has no requirements. |

**Examples**

- `Schema<string>` (defaulted to `Schema<string, string, never>`) represents a schema that decodes to `string`, encodes to `string`, and has no requirements.
- `Schema<number, string>` (defaulted to `Schema<number, string, never>`) represents a schema that decodes to `number` from `string`, encodes a `number` to a `string`, and has no requirements.

<Aside type="note" title="Type Parameter Abbreviations">
  In the Effect ecosystem, you may often encounter the type parameters of
  `Schema` abbreviated as `A`, `I`, and `R` respectively. This is just
  shorthand for the type value of type **A**, **I**nput, and
  **R**equirements.
</Aside>
