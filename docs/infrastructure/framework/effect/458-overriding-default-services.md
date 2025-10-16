## Overriding Default Services

Sometimes, you might need to replace the default services with custom implementations. Effect provides built-in utilities to override these services using `Effect.with<service>` and `Effect.with<service>Scoped`.

- `Effect.with<service>`: Overrides a service for the duration of the effect.
- `Effect.with<service>Scoped`: Overrides a service within a scope and restores the original service afterward.

| Function                          | Description                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `Effect.withClock`                | Executes an effect using a specific `Clock` service.                           |
| `Effect.withClockScoped`          | Temporarily overrides the `Clock` service and restores it when the scope ends. |
| `Effect.withConfigProvider`       | Executes an effect using a specific `ConfigProvider` service.                  |
| `Effect.withConfigProviderScoped` | Temporarily overrides the `ConfigProvider` service within a scope.             |
| `Effect.withConsole`              | Executes an effect using a specific `Console` service.                         |
| `Effect.withConsoleScoped`        | Temporarily overrides the `Console` service within a scope.                    |
| `Effect.withRandom`               | Executes an effect using a specific `Random` service.                          |
| `Effect.withRandomScoped`         | Temporarily overrides the `Random` service within a scope.                     |
| `Effect.withTracer`               | Executes an effect using a specific `Tracer` service.                          |
| `Effect.withTracerScoped`         | Temporarily overrides the `Tracer` service within a scope.                     |

**Example** (Overriding Random Service)

```ts twoslash
import { Effect, Random } from 'effect'

// A program that logs a random number
const program = Effect.gen(function* () {
  console.log(yield* Random.next)
})

Effect.runSync(program)
// Example Output: 0.23208633934454326 (varies each run)

// Override the Random service with a seeded generator
const override = program.pipe(Effect.withRandom(Random.make('myseed')))

Effect.runSync(override)
// Output: 0.6862142528438508 (consistent output with the seed)
```

# [Layer Memoization](https://effect.website/docs/requirements-management/layer-memoization/)
