## ParseError

The `Schema.decodeUnknownEither` and `Schema.encodeEither` functions returns a [Either](/docs/data-types/either/):

```ts showLineNumbers=false
Either<Type, ParseError>
```

where `ParseError` is defined as follows (simplified):

```ts showLineNumbers=false
interface ParseError {
  readonly _tag: 'ParseError'
  readonly issue: ParseIssue
}
```

In this structure, `ParseIssue` represents an error that might occur during the parsing process.
It is wrapped in a tagged error to make it easier to catch errors using [Effect.catchTag](/docs/error-management/expected-errors/#catchtag).
The result `Either<Type, ParseError>` contains the inferred data type described by the schema (`Type`).
A successful parse yields a `Right` value with the parsed data `Type`, while a failed parse results in a `Left` value containing a `ParseError`.

<Aside type="tip" title="Returning All Errors">
  By default only the first error is returned. You can use the
  [`errors`](#receive-all-errors) option to receive all errors.
</Aside>
