## The Predicate Function

The predicate function in a filter follows this structure:

```ts
type Predicate = (a: A, options: ParseOptions, self: AST.Refinement) => FilterReturnType
```

where

```ts
interface FilterIssue {
  readonly path: ReadonlyArray<PropertyKey>
  readonly issue: string | ParseResult.ParseIssue
}

type FilterOutput = undefined | boolean | string | ParseResult.ParseIssue | FilterIssue

type FilterReturnType = FilterOutput | ReadonlyArray<FilterOutput>
```

The filter's predicate can return several types of values, each affecting validation in a different way:

| Return Type                   | Behavior                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `true` or `undefined`         | The data satisfies the filter's condition and passes validation.                                 |
| `false`                       | The data does not meet the condition, and no specific error message is provided.                 |
| `string`                      | The validation fails, and the provided string is used as the error message.                      |
| `ParseResult.ParseIssue`      | The validation fails with a detailed error structure, specifying where and why it failed.        |
| `FilterIssue`                 | Allows for more detailed error messages with specific paths, providing enhanced error reporting. |
| `ReadonlyArray<FilterOutput>` | An array of issues can be returned if multiple validation errors need to be reported.            |

<Aside type="tip" title="Effectful Filters">
  Normal filters only handle synchronous, non-effectful validations. If
  you need filters that involve asynchronous logic or side effects,
  consider using
  [Schema.filterEffect](/docs/schema/transformations/#effectful-filters).
</Aside>
