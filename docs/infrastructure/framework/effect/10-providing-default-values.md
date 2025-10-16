## Providing Default Values

Sometimes, you may encounter situations where an environment variable is missing, leading to an incomplete configuration. To address this, Effect provides the `Config.withDefault` function, which allows you to specify a default value. This fallback ensures that your application continues to function even if a required environment variable is not set.

**Example** (Using Default Values)

```ts twoslash title="defaults.ts"
import { Effect, Config } from 'effect'

const program = Effect.gen(function* () {
  const host = yield* Config.string('HOST')
  // Use default 8080 if PORT is not set
  const port = yield* Config.number('PORT').pipe(Config.withDefault(8080))
  console.log(`Application started: ${host}:${port}`)
})

Effect.runPromise(program)
```

Running this program with only the `HOST` environment variable set:

```sh showLineNumbers=false
HOST=localhost npx tsx defaults.ts
```

produces the following output:

```ansi showLineNumbers=false
Application started: localhost:8080
```

In this case, even though the `PORT` environment variable is not set, the program continues to run, using the default value of `8080` for the port. This ensures that the application remains functional without requiring every configuration to be explicitly provided.
