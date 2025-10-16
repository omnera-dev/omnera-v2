## Error Channel Operations

| Effect                 | Micro                    | ⚠️                                    |
| ---------------------- | ------------------------ | ------------------------------------- |
| ❌                     | `Micro.filterOrFailWith` |                                       |
| `Effect.tapErrorCause` | `Micro.tapErrorCause`    | `MicroCause<E>` instead of `Cause<E>` |
| ❌                     | `Micro.tapCauseIf`       |                                       |
| `Effect.tapDefect`     | `Micro.tapDefect`        | `unknown` instead of `Cause<never>`   |
