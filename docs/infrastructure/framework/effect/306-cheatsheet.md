## Cheatsheet

Let's summarize the transformation functions we have seen so far:

| API       | Input                                     | Output                      |
| --------- | ----------------------------------------- | --------------------------- |
| `map`     | `Effect<A, E, R>`, `A => B`               | `Effect<B, E, R>`           |
| `flatMap` | `Effect<A, E, R>`, `A => Effect<B, E, R>` | `Effect<B, E, R>`           |
| `andThen` | `Effect<A, E, R>`, \*                     | `Effect<B, E, R>`           |
| `tap`     | `Effect<A, E, R>`, `A => Effect<B, E, R>` | `Effect<A, E, R>`           |
| `all`     | `[Effect<A, E, R>, Effect<B, E, R>, ...]` | `Effect<[A, B, ...], E, R>` |

# [Control Flow Operators](https://effect.website/docs/getting-started/control-flow/)
