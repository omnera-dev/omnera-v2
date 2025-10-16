## Creating a Deferred

A deferred can be created using the `Deferred.make` constructor. This returns an effect that represents the creation of the deferred. Since the creation of a deferred involves memory allocation, it must be done within an effect to ensure safe management of resources.

**Example** (Creating a Deferred)

```ts twoslash
import { Deferred } from "effect"

//      ┌─── Effect<Deferred<string, Error>>
//      ▼
const deferred = Deferred.make<string, Error>()
```
