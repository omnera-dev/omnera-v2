## Creating Effects

| Effect                 | Micro                | ⚠️                                   |
| ---------------------- | -------------------- | ------------------------------------ |
| `Effect.try`           | `Micro.try`          | requires a `try` block               |
| `Effect.tryPromise`    | `Micro.tryPromise`   | requires a `try` block               |
| `Effect.sleep`         | `Micro.sleep`        | only handles milliseconds            |
| `Effect.failCause`     | `Micro.failWith`     | uses `MicroCause` instead of `Cause` |
| `Effect.failCauseSync` | `Micro.failWithSync` | uses `MicroCause` instead of `Cause` |
| ❌                     | `Micro.make`         |                                      |
| ❌                     | `Micro.fromOption`   |                                      |
| ❌                     | `Micro.fromEither`   |                                      |
