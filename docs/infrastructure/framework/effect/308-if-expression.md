## if Expression

When working with Effect values, we can use standard JavaScript if-then-else statements:

**Example** (Returning None for Invalid Weight)

Here we are using the [Option](/docs/data-types/option/) data type to represent the absence of a valid value.

```ts twoslash
import { Effect, Option } from 'effect'

// Function to validate weight and return an Option
const validateWeightOption = (weight: number): Effect.Effect<Option.Option<number>> => {
  if (weight >= 0) {
    // Return Some if the weight is valid
    return Effect.succeed(Option.some(weight))
  } else {
    // Return None if the weight is invalid
    return Effect.succeed(Option.none())
  }
}
```

**Example** (Returning Error for Invalid Weight)

You can also handle invalid inputs by using the error channel, which allows you to return an error when the input is invalid:

```ts twoslash
import { Effect } from 'effect'

// Function to validate weight or fail with an error
const validateWeightOrFail = (weight: number): Effect.Effect<number, string> => {
  if (weight >= 0) {
    // Return the weight if valid
    return Effect.succeed(weight)
  } else {
    // Fail with an error if invalid
    return Effect.fail(`negative input: ${weight}`)
  }
}
```
