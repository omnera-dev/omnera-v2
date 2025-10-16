## Nested Configurations

We've seen how to define configurations at the top level, whether for primitive or custom types. In some cases, though, you might want to structure your configurations in a more nested way, organizing them under common namespaces for clarity and manageability.

For instance, consider the following `ServiceConfig` type:

```ts twoslash
class ServiceConfig {
  constructor(
    readonly host: string,
    readonly port: number,
    readonly timeout: number
  ) {}
  get url() {
    return `${this.host}:${this.port}`
  }
}
```

If you were to use this configuration in your application, it would expect the `HOST`, `PORT`, and `TIMEOUT` environment variables at the top level. But in many cases, you may want to organize configurations under a shared namespace—for example, grouping `HOST` and `PORT` under a `SERVER` namespace, while keeping `TIMEOUT` at the root.

To do this, you can use the `Config.nested` operator, which allows you to nest configuration values under a specific namespace. Let's update the previous example to reflect this:

```ts twoslash
import { Config } from "effect"

class ServiceConfig {
  constructor(
    readonly host: string,
    readonly port: number,
    readonly timeout: number
  ) {}
  get url() {
    return `${this.host}:${this.port}`
  }
}

const serverConfig = Config.all([
  Config.string("HOST"),
  Config.number("PORT")
])

const serviceConfig = Config.map(
  Config.all([
    // Read 'HOST' and 'PORT' from 'SERVER' namespace
    Config.nested(serverConfig, "SERVER"),
    // Read 'TIMEOUT' from the root namespace
    Config.number("TIMEOUT")
  ]),
  ([[host, port], timeout]) => new ServiceConfig(host, port, timeout)
)
```

Now, if you run your application with this configuration setup, it will look for the following environment variables:

- `SERVER_HOST` for the host value
- `SERVER_PORT` for the port value
- `TIMEOUT` for the timeout value

This structured approach keeps your configuration more organized, especially when dealing with multiple services or complex applications.
