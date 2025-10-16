## Environment

In Effect, we represent the environment required to run an effect workflow as a **union** of services:

**Example** (Defining the Environment with a Union of Services)

```ts twoslash "Console | Logger"
import { Effect } from "effect"

interface IOError {
  readonly _tag: "IOError"
}

interface HttpError {
  readonly _tag: "HttpError"
}

interface Console {
  readonly log: (msg: string) => void
}

interface Logger {
  readonly log: (msg: string) => void
}

type Response = Record<string, string>

// `R` is a union of `Console` and `Logger`
type Http = Effect.Effect<Response, IOError | HttpError, Console | Logger>
```

This may be confusing to folks coming from ZIO, where the environment is represented as an **intersection** of services:

```scala showLineNumbers=false
type Http = ZIO[Console with Logger, IOError, Response]
```
