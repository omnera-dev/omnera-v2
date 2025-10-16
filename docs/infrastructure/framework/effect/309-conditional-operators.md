## Conditional Operators

### if

Executes one of two effects based on a condition evaluated by an effectful predicate.

Use `Effect.if` to run one of two effects depending on whether the predicate effect
evaluates to `true` or `false`. If the predicate is `true`, the `onTrue` effect
is executed. If it is `false`, the `onFalse` effect is executed instead.

**Example** (Simulating a Coin Flip)

In this example, we simulate a virtual coin flip using `Random.nextBoolean` to generate a random boolean value. If the value is `true`, the `onTrue` effect logs "Head". If the value is `false`, the `onFalse` effect logs "Tail".

```ts twoslash
import { Effect, Random, Console } from 'effect'

const flipTheCoin = Effect.if(Random.nextBoolean, {
  onTrue: () => Console.log('Head'), // Runs if the predicate is true
  onFalse: () => Console.log('Tail'), // Runs if the predicate is false
})

Effect.runFork(flipTheCoin)
```

### when

Conditionally executes an effect based on a boolean condition.

`Effect.when` allows you to conditionally execute an effect, similar to using
an `if (condition)` expression, but with the added benefit of handling
effects. If the condition is `true`, the effect is executed; otherwise, it
does nothing.

The result of the effect is wrapped in an `Option<A>` to indicate whether the
effect was executed. If the condition is `true`, the result of the effect is
wrapped in a `Some`. If the condition is `false`, the result is `None`,
representing that the effect was skipped.

**Example** (Conditional Effect Execution)

```ts twoslash
import { Effect, Option } from 'effect'

const validateWeightOption = (weight: number): Effect.Effect<Option.Option<number>> =>
  // Conditionally execute the effect if the weight is non-negative
  Effect.succeed(weight).pipe(Effect.when(() => weight >= 0))

// Run with a valid weight
Effect.runPromise(validateWeightOption(100)).then(console.log)
/*
Output:
{
  _id: "Option",
  _tag: "Some",
  value: 100
}
*/

// Run with an invalid weight
Effect.runPromise(validateWeightOption(-5)).then(console.log)
/*
Output:
{
  _id: "Option",
  _tag: "None"
}
*/
```

In this example, the [Option](/docs/data-types/option/) data type is used to represent the presence or absence of a valid value. If the condition evaluates to `true` (in this case, if the weight is non-negative), the effect is executed and wrapped in a `Some`. Otherwise, the result is `None`.

### whenEffect

Executes an effect conditionally, based on the result of another effect.

Use `Effect.whenEffect` when the condition to determine whether to execute the effect
depends on the outcome of another effect that produces a boolean value.
If the condition effect evaluates to `true`, the specified effect is executed.
If it evaluates to `false`, no effect is executed.

The result of the effect is wrapped in an `Option<A>` to indicate whether the
effect was executed. If the condition is `true`, the result of the effect is
wrapped in a `Some`. If the condition is `false`, the result is `None`,
representing that the effect was skipped.

**Example** (Using an Effect as a Condition)

The following function creates a random integer, but only if a randomly generated boolean is `true`.

```ts twoslash
import { Effect, Random } from 'effect'

const randomIntOption = Random.nextInt.pipe(Effect.whenEffect(Random.nextBoolean))

console.log(Effect.runSync(randomIntOption))
/*
Example Output:
{ _id: 'Option', _tag: 'Some', value: 8609104974198840 }
*/
```

### unless / unlessEffect

The `Effect.unless` and `Effect.unlessEffect` functions are similar to the `when*` functions, but they are equivalent to the `if (!condition) expression` construct.
