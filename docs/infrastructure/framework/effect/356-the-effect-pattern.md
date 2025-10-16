## The Effect Pattern

While Effect is a vast ecosystem of many different tools, if it had to be reduced down to just one idea, it would be the following:

Effect's major unique insight is that we can use the type system to track **errors** and **context**, not only **success** values as shown in the divide example above.

Here's the same divide function from above, but with the Effect pattern:

```ts twoslash
import { Effect } from "effect"

const divide = (
  a: number,
  b: number
): Effect.Effect<number, Error, never> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)
```

With this approach, the function no longer throws exceptions. Instead, errors are handled as values, which can be passed along like success values. The type signature also makes it clear:

- What success value the function returns (`number`).
- What error can occur (`Error`).
- What additional context or dependencies are required (`never` indicates none).

```text showLineNumbers=false
         ┌─── Produces a value of type number
         │       ┌─── Fails with an Error
         │       │      ┌─── Requires no dependencies
         ▼       ▼      ▼
Effect<number, Error, never>
```

Additionally, tracking context allows you to provide additional information to your functions without having to pass in everything as an argument. For example, you can swap out implementations of live external services with mocks during your tests without changing any core business logic.
