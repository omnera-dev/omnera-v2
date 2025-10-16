## Cheatsheet

The table provides a summary of the available constructors, along with their input and output types, allowing you to choose the appropriate function based on your needs.

| API                     | Given                              | Result                        |
| ----------------------- | ---------------------------------- | ----------------------------- |
| `succeed`               | `A`                                | `Effect<A>`                   |
| `fail`                  | `E`                                | `Effect<never, E>`            |
| `sync`                  | `() => A`                          | `Effect<A>`                   |
| `try`                   | `() => A`                          | `Effect<A, UnknownException>` |
| `try` (overload)        | `() => A`, `unknown => E`          | `Effect<A, E>`                |
| `promise`               | `() => Promise<A>`                 | `Effect<A>`                   |
| `tryPromise`            | `() => Promise<A>`                 | `Effect<A, UnknownException>` |
| `tryPromise` (overload) | `() => Promise<A>`, `unknown => E` | `Effect<A, E>`                |
| `async`                 | `(Effect<A, E> => void) => void`   | `Effect<A, E>`                |
| `suspend`               | `() => Effect<A, E, R>`            | `Effect<A, E, R>`             |

For the complete list of constructors, visit the [Effect Constructors Documentation](https://effect-ts.github.io/effect/effect/Effect.ts.html#constructors).

# [Importing Effect](https://effect.website/docs/getting-started/importing-effect/)
