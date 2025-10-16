## Retrieval of Failures and Defects

To specifically collect failures or defects from a `Cause`, you can use `Cause.failures` and `Cause.defects`. These functions allow you to inspect only the errors or unexpected defects that occurred.

**Example** (Extracting Failures and Defects from a Cause)

```ts twoslash
import { Effect, Cause } from 'effect'

const program = Effect.gen(function* () {
  const cause = yield* Effect.cause(
    Effect.all([Effect.fail('error 1'), Effect.die('defect'), Effect.fail('error 2')])
  )
  console.log(Cause.failures(cause))
  console.log(Cause.defects(cause))
})

Effect.runPromise(program)
/*
Output:
{ _id: 'Chunk', values: [ 'error 1' ] }
{ _id: 'Chunk', values: [] }
*/
```

# [Chunk](https://effect.website/docs/data-types/chunk/)
