## Data.TaggedError

The `Data.TaggedError` constructor lets you define custom yieldable errors with unique tags. Each error has a `_tag` property, allowing you to easily distinguish between different error types. This makes it convenient to handle specific tagged errors using functions like [Effect.catchTag](/docs/error-management/expected-errors/#catchtag) or [Effect.catchTags](/docs/error-management/expected-errors/#catchtags).

**Example** (Handling Multiple Tagged Errors)

```ts twoslash
import { Effect, Data, Random } from "effect"

// An error with _tag: "Foo"
class FooError extends Data.TaggedError("Foo")<{
  message: string
}> {}

// An error with _tag: "Bar"
class BarError extends Data.TaggedError("Bar")<{
  randomNumber: number
}> {}

const program = Effect.gen(function* () {
  const n = yield* Random.next
  return n > 0.5
    ? "yay!"
    : n < 0.2
    ? yield* new FooError({ message: "Oh no!" })
    : yield* new BarError({ randomNumber: n })
}).pipe(
  // Handle different tagged errors using catchTags
  Effect.catchTags({
    Foo: (error) => Effect.succeed(`Foo error: ${error.message}`),
    Bar: (error) => Effect.succeed(`Bar error: ${error.randomNumber}`)
  })
)

Effect.runPromise(program).then(console.log, console.error)
/*
Example Output (n < 0.2):
Foo error: Oh no!
*/
```

# [BigDecimal](https://effect.website/docs/data-types/bigdecimal/)
