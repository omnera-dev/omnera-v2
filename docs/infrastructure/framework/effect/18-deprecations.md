## Deprecations

### Secret <Badge text="Deprecated" variant="caution" />

_Deprecated since version 3.3.0: Please use [Config.redacted](#handling-sensitive-values) for handling sensitive information going forward._

The `Config.secret` function was previously used to secure sensitive information in a similar way to `Config.redacted`. It wraps configuration values in a `Secret` type, which also conceals details when logged but allows access via `Secret.value`.

**Example** (Using Deprecated `Config.secret`)

```ts twoslash title="secret.ts"
import { Effect, Config, Secret } from "effect"

const program = Effect.gen(function* () {
  const secret = yield* Config.secret("API_KEY")

  // Log the secret value, which won't reveal the actual secret
  console.log(`Console output: ${secret}`)

  // Access the real value using Secret.value and log it
  console.log(`Actual value: ${Secret.value(secret)}`)
})

Effect.runPromise(program)
```

When this program is executed:

```sh showLineNumbers=false
API_KEY=my-api-key tsx secret.ts
```

The output will look like this:

```ansi showLineNumbers=false
Console output: Secret(<redacted>)
Actual value: my-api-key
```

# [Introduction to Runtime](https://effect.website/docs/runtime/)
