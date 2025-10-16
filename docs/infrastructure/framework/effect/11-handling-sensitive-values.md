## Handling Sensitive Values

Some configuration values, like API keys, should not be printed in logs.

The `Config.redacted` function is used to handle sensitive information safely.
It parses the configuration value and wraps it in a `Redacted<string>`, a specialized [data type](/docs/data-types/redacted/) designed to protect secrets.

When you log a `Redacted` value using `console.log`, the actual content remains hidden, providing an extra layer of security. To access the real value, you must explicitly use `Redacted.value`.

**Example** (Protecting Sensitive Data)

```ts twoslash title="redacted.ts"
import { Effect, Config, Redacted } from "effect"

const program = Effect.gen(function* () {
  //      ┌─── Redacted<string>
  //      ▼
  const redacted = yield* Config.redacted("API_KEY")

  // Log the redacted value, which won't reveal the actual secret
  console.log(`Console output: ${redacted}`)

  // Access the real value using Redacted.value and log it
  console.log(`Actual value: ${Redacted.value(redacted)}`)
})

Effect.runPromise(program)
```

When this program is executed:

```sh showLineNumbers=false
API_KEY=my-api-key tsx redacted.ts
```

The output will look like this:

```ansi showLineNumbers=false
Console output: <redacted>
Actual value: my-api-key
```

As shown, when logging the `Redacted` value using `console.log`, the output is `<redacted>`, ensuring that sensitive data remains concealed. However, by using `Redacted.value`, the true value (`"my-api-key"`) can be accessed and displayed, providing controlled access to the secret.

### Wrapping a Config with Redacted

By default, when you pass a string to `Config.redacted`, it returns a `Redacted<string>`. You can also pass a `Config` (such as `Config.number`) to ensure that only validated values are accepted. This adds an extra layer of security by ensuring that sensitive data is properly validated before being redacted.

**Example** (Redacting and Validating a Number)

```ts twoslash
import { Effect, Config, Redacted } from "effect"

const program = Effect.gen(function* () {
  // Wrap the validated number configuration with redaction
  //
  //      ┌─── Redacted<number>
  //      ▼
  const redacted = yield* Config.redacted(Config.number("SECRET"))

  console.log(`Console output: ${redacted}`)
  console.log(`Actual value: ${Redacted.value(redacted)}`)
})

Effect.runPromise(program)
```
