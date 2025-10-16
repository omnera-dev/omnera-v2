## Custom Configuration Types

Effect allows you to define configurations for custom types by combining primitive configurations using [combinators](#combining-configurations) and [operators](#operators).

For example, let's create a `HostPort` class, which has two fields: `host` and `port`.

```ts twoslash
class HostPort {
  constructor(readonly host: string, readonly port: number) {}
  get url() {
    return `${this.host}:${this.port}`
  }
}
```

To define a configuration for this custom type, we can combine primitive configs for `string` and `number`:

**Example** (Defining a Custom Configuration)

```ts twoslash
import { Config } from "effect"

class HostPort {
  constructor(readonly host: string, readonly port: number) {}
  get url() {
    return `${this.host}:${this.port}`
  }
}

// Combine the configuration for 'HOST' and 'PORT'
const both = Config.all([Config.string("HOST"), Config.number("PORT")])

// Map the configuration values into a HostPort instance
const config = Config.map(
  both,
  ([host, port]) => new HostPort(host, port)
)
```

In this example, `Config.all(configs)` combines two primitive configurations, `Config<string>` and `Config<number>`, into a `Config<[string, number]>`. The `Config.map` operator is then used to transform these values into an instance of the `HostPort` class.

**Example** (Using Custom Configuration)

```ts twoslash title="App.ts"
import { Effect, Config } from "effect"

class HostPort {
  constructor(readonly host: string, readonly port: number) {}
  get url() {
    return `${this.host}:${this.port}`
  }
}

// Combine the configuration for 'HOST' and 'PORT'
const both = Config.all([Config.string("HOST"), Config.number("PORT")])

// Map the configuration values into a HostPort instance
const config = Config.map(
  both,
  ([host, port]) => new HostPort(host, port)
)

// Main program that reads configuration and starts the application
const program = Effect.gen(function* () {
  const hostPort = yield* config
  console.log(`Application started: ${hostPort.url}`)
})

Effect.runPromise(program)
```

When you run this program, it will try to retrieve the values for `HOST` and `PORT` from your environment variables:

```sh showLineNumbers=false
HOST=localhost PORT=8080 npx tsx App.ts
```

If successful, it will print:

```ansi showLineNumbers=false
Application started: localhost:8080
```
