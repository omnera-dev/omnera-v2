## Map Operations

### mapError

The `Effect.mapError` function is used when you need to transform or modify an error produced by an effect, without affecting the success value. This can be helpful when you want to add extra information to the error or change its type.

**Example** (Mapping an Error)

Here, the error type changes from `string` to `Error`.

```ts twoslash
import { Effect } from 'effect'

//      ┌─── Effect<number, string, never>
//      ▼
const simulatedTask = Effect.fail('Oh no!').pipe(Effect.as(1))

//      ┌─── Effect<number, Error, never>
//      ▼
const mapped = Effect.mapError(simulatedTask, (message) => new Error(message))
```

<Aside type="note">
  It's important to note that using the `Effect.mapError` function does
  not change the overall success or failure of the effect. It only
  transforms the values in the error channel while preserving the effect's
  original success or failure status.
</Aside>

### mapBoth

The `Effect.mapBoth` function allows you to apply transformations to both channels: the error channel and the success channel of an effect. It takes two map functions as arguments: one for the error channel and the other for the success channel.

**Example** (Mapping Both Success and Error)

```ts twoslash
import { Effect } from 'effect'

//      ┌─── Effect<number, string, never>
//      ▼
const simulatedTask = Effect.fail('Oh no!').pipe(Effect.as(1))

//      ┌─── Effect<boolean, Error, never>
//      ▼
const modified = Effect.mapBoth(simulatedTask, {
  onFailure: (message) => new Error(message),
  onSuccess: (n) => n > 0,
})
```

<Aside type="note">
  It's important to note that using the `Effect.mapBoth` function does not
  change the overall success or failure of the effect. It only transforms
  the values in the error and success channels while preserving the
  effect's original success or failure status.
</Aside>
