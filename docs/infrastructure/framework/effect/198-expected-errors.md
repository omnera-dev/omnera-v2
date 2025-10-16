## Expected Errors

These errors, also referred to as _failures_, _typed errors_
or _recoverable errors_, are errors that developers anticipate as part of the normal program execution.
They serve a similar purpose to checked exceptions and play a role in defining the program's domain and control flow.

Expected errors **are tracked** at the type level by the `Effect` data type in the "Error" channel:

```ts "HttpError" showLineNumbers=false
const program: Effect<string, HttpError, never>
```

it is evident from the type that the program can fail with an error of type `HttpError`.
