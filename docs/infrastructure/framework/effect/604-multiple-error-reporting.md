## Multiple Error Reporting

The `Schema.filter` API supports reporting multiple validation issues at once, which is especially useful in scenarios like form validation where several checks might fail simultaneously.

**Example** (Reporting Multiple Validation Errors)

```ts twoslash
import { Either, Schema, ParseResult } from 'effect'

const Password = Schema.Trim.pipe(Schema.minLength(2))
const OptionalString = Schema.optional(Schema.String)

const MyForm = Schema.Struct({
  password: Password,
  confirm_password: Password,
  name: OptionalString,
  surname: OptionalString,
}).pipe(
  Schema.filter((input) => {
    const issues: Array<Schema.FilterIssue> = []

    // Check if passwords match
    if (input.password !== input.confirm_password) {
      issues.push({
        path: ['confirm_password'],
        message: 'Passwords do not match',
      })
    }

    // Ensure either name or surname is present
    if (!input.name && !input.surname) {
      issues.push({
        path: ['surname'],
        message: 'Surname must be present if name is not present',
      })
    }
    return issues
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
{
  "_id": "Either",
  "_tag": "Left",
  "left": [
    {
      "_tag": "Type",
      "path": [
        "confirm_password"
      ],
      "message": "Passwords do not match"
    },
    {
      "_tag": "Type",
      "path": [
        "surname"
      ],
      "message": "Surname must be present if name is not present"
    }
  ]
}
*/
```

In this example, we define a `MyForm` schema with fields for password validation and optional name/surname fields. The `Schema.filter` function checks if the passwords match and ensures that either a name or surname is provided. If either validation fails, the corresponding error message is associated with the relevant field and both errors are returned in a structured format.

<Aside type="tip" title="Using ArrayFormatter for Structured Errors">
  The `ArrayFormatter` provides a detailed and structured error format
  rather than a simple error string. This is especially useful when
  handling complex forms or structured data. For more information, see
  [ArrayFormatter](/docs/schema/error-formatters/#arrayformatter).
</Aside>
