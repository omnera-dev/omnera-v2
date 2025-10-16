## Extracting the Service Type

To retrieve the service type from a tag, use the `Context.Tag.Service` utility type.

**Example** (Extracting Service Type)

```ts twoslash
import { Effect, Context } from "effect"

// Declaring a tag
class Random extends Context.Tag("MyRandomService")<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

// Extracting the type
type RandomShape = Context.Tag.Service<Random>
/*
This is equivalent to:
type RandomShape = {
    readonly next: Effect.Effect<number>;
}
*/
```
