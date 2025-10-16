## Creating a Semaphore

The `Effect.makeSemaphore` function initializes a semaphore with a specified number of permits.
Each permit allows one task to access a resource or perform an operation concurrently, and multiple permits enable a configurable level of concurrency.

**Example** (Creating a Semaphore with 3 Permits)

```ts twoslash
import { Effect } from "effect"

// Create a semaphore with 3 permits
const mutex = Effect.makeSemaphore(3)
```
