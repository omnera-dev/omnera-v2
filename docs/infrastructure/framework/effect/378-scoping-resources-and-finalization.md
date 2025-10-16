## Scoping, Resources and Finalization

| Effect                     | Micro                     | ⚠️                                       |
| -------------------------- | ------------------------- | ---------------------------------------- |
| `Effect.addFinalizer`      | `Micro.addFinalizer`      | `MicroExit` instead of `Exit` and no `R` |
| `Effect.acquireRelease`    | `Micro.acquireRelease`    | `MicroExit` instead of `Exit`            |
| `Effect.acquireUseRelease` | `Micro.acquireUseRelease` | `MicroExit` instead of `Exit`            |
| `Effect.onExit`            | `Micro.onExit`            | `MicroExit` instead of `Exit`            |
| `Effect.onError`           | `Micro.onError`           | uses `MicroCause` instead of `Cause`     |
| ❌                         | `Micro.onExitIf`          |                                          |
