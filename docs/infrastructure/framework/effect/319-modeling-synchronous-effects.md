## Modeling Synchronous Effects

In JavaScript, you can delay the execution of synchronous computations using "thunks".

<Aside type="note" title="Thunks">
  A "thunk" is a function that takes no arguments and may return some
  value.
</Aside>

Thunks are useful for delaying the computation of a value until it is needed.

To model synchronous side effects, Effect provides the `Effect.sync` and `Effect.try` constructors, which accept a thunk.

### sync

Creates an `Effect` that represents a synchronous side-effectful computation.

Use `Effect.sync` when you are sure the operation will not fail.

The provided function (`thunk`) must not throw errors; if it does, the error will be treated as a ["defect"](/docs/error-management/unexpected-errors/).

This defect is not a standard error but indicates a flaw in the logic that was expected to be error-free.
You can think of it similar to an unexpected crash in the program, which can be further managed or logged using tools like [Effect.catchAllDefect](/docs/error-management/unexpected-errors/#catchalldefect).
This feature ensures that even unexpected failures in your application are not lost and can be handled appropriately.

**Example** (Logging a Message)

In the example below, `Effect.sync` is used to defer the side-effect of writing to the console.

```ts twoslash
import { Effect } from 'effect'

const log = (message: string) =>
  Effect.sync(() => {
    console.log(message) // side effect
  })

//      ┌─── Effect<void, never, never>
//      ▼
const program = log('Hello, World!')
```

The side effect (logging to the console) encapsulated within `program` won't occur until the effect is explicitly run (see the [Running Effects](/docs/getting-started/running-effects/) section for more details). This allows you to define side effects at one point in your code and control when they are activated, improving manageability and predictability of side effects in larger applications.

### try

Creates an `Effect` that represents a synchronous computation that might fail.

In situations where you need to perform synchronous operations that might fail, such as parsing JSON, you can use the `Effect.try` constructor.
This constructor is designed to handle operations that could throw exceptions by capturing those exceptions and transforming them into manageable errors.

**Example** (Safe JSON Parsing)

Suppose you have a function that attempts to parse a JSON string. This operation can fail and throw an error if the input string is not properly formatted as JSON:

```ts twoslash
import { Effect } from 'effect'

const parse = (input: string) =>
  // This might throw an error if input is not valid JSON
  Effect.try(() => JSON.parse(input))

//      ┌─── Effect<any, UnknownException, never>
//      ▼
const program = parse('')
```

In this example:

- `parse` is a function that creates an effect encapsulating the JSON parsing operation.
- If `JSON.parse(input)` throws an error due to invalid input, `Effect.try` catches this error and the effect represented by `program` will fail with an `UnknownException`. This ensures that errors are not silently ignored but are instead handled within the structured flow of effects.

#### Customizing Error Handling

You might want to transform the caught exception into a more specific error or perform additional operations when catching an error. `Effect.try` supports an overload that allows you to specify how caught exceptions should be transformed:

**Example** (Custom Error Handling)

```ts twoslash {8}
import { Effect } from 'effect'

const parse = (input: string) =>
  Effect.try({
    // JSON.parse may throw for bad input
    try: () => JSON.parse(input),
    // remap the error
    catch: (unknown) => new Error(`something went wrong ${unknown}`),
  })

//      ┌─── Effect<any, Error, never>
//      ▼
const program = parse('')
```

You can think of this as a similar pattern to the traditional try-catch block in JavaScript:

```ts showLineNumbers=false
try {
  return JSON.parse(input)
} catch (unknown) {
  throw new Error(`something went wrong ${unknown}`)
}
```
