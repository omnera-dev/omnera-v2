## Specifying Error Paths

When validating forms or structured data, it's possible to associate specific error messages with particular fields or paths. This enhances error reporting and is especially useful when integrating with libraries like [react-hook-form](https://react-hook-form.com/).

**Example** (Matching Passwords)

```ts twoslash
import { Either, Schema, ParseResult } from 'effect'

const Password = Schema.Trim.pipe(Schema.minLength(2))

const MyForm = Schema.Struct({
  password: Password,
  confirm_password: Password,
}).pipe(
  // Add a filter to ensure that passwords match
  Schema.filter((input) => {
    if (input.password !== input.confirm_password) {
      // Return an error message associated
      // with the "confirm_password" field
      return {
        path: ['confirm_password'],
        message: 'Passwords do not match',
      }
    }
  })
)

console.log(
  JSON.stringify(
    Schema.decodeUnknownEither(MyForm)({
      password: 'abc',
      confirm_password: 'abd', // Confirm password does not match
    }).pipe(Either.mapLeft((error) => ParseResult.ArrayFormatter.formatErrorSync(error))),
    null,
    2
  )
)
/*
  "_id": "Either",
  "_tag": "Left",
  "left": [
    {
      "_tag": "Type",
      "path": [
        "confirm_password"
      ],
      "message": "Passwords do not match"
    }
  ]
}
*/
```

In this example, we define a `MyForm` schema with two password fields (`password` and `confirm_password`). We use `Schema.filter` to check that both passwords match. If they don't, an error message is returned, specifically associated with the `confirm_password` field. This makes it easier to pinpoint the exact location of the validation failure.

The error is formatted in a structured way using `ArrayFormatter`, allowing for easier post-processing and integration with form libraries.

<Aside type="tip" title="Using ArrayFormatter for Structured Errors">
  The `ArrayFormatter` provides a detailed and structured error format
  rather than a simple error string. This is especially useful when
  handling complex forms or structured data. For more information, see
  [ArrayFormatter](/docs/schema/error-formatters/#arrayformatter).
</Aside>
