## Basic Configuration Types

Effect provides several built-in types for configuration values, which you can use right out of the box:

| Type       | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `string`   | Reads a configuration value as a string.                                |
| `number`   | Reads a value as a floating-point number.                               |
| `boolean`  | Reads a value as a boolean (`true` or `false`).                         |
| `integer`  | Reads a value as an integer.                                            |
| `date`     | Parses a value into a `Date` object.                                    |
| `literal`  | Reads a fixed literal (\*).                                             |
| `logLevel` | Reads a value as a [LogLevel](/docs/observability/logging/#log-levels). |
| `duration` | Parses a value as a time duration.                                      |
| `redacted` | Reads a **sensitive value**, ensuring it is protected when logged.      |
| `url`      | Parses a value as a valid URL.                                          |

(\*) `string | number | boolean | null | bigint`

**Example** (Loading Environment Variables)

Here's an example of loading a basic configuration using environment variables for `HOST` and `PORT`:

```ts twoslash title="primitives.ts"
import { Effect, Config } from 'effect'

// Define a program that loads HOST and PORT configuration
const program = Effect.gen(function* () {
  const host = yield* Config.string('HOST') // Read as a string
  const port = yield* Config.number('PORT') // Read as a number

  console.log(`Application started: ${host}:${port}`)
})

Effect.runPromise(program)
```

If you run this without setting the required environment variables:

```sh showLineNumbers=false
npx tsx primitives.ts
```

you'll see an error indicating the missing configuration:

```ansi showLineNumbers=false
[Error: (Missing data at HOST: "Expected HOST to exist in the process context")] {
  name: '(FiberFailure) Error',
  [Symbol(effect/Runtime/FiberFailure)]: Symbol(effect/Runtime/FiberFailure),
  [Symbol(effect/Runtime/FiberFailure/Cause)]: {
    _tag: 'Fail',
    error: {
      _op: 'MissingData',
      path: [ 'HOST' ],
      message: 'Expected HOST to exist in the process context'
    }
  }
}
```

To run the program successfully, set the environment variables as shown below:

```sh showLineNumbers=false
HOST=localhost PORT=8080 npx tsx primitives.ts
```

Output:

```ansi showLineNumbers=false
Application started: localhost:8080
```
