## Operators

Effect provides several built-in operators to work with configurations, allowing you to manipulate and transform them according to your needs.

### Transforming Operators

These operators enable you to modify configurations or validate their values:

| Operator     | Description                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `validate`   | Ensures that a configuration meets certain criteria, returning a validation error if it does not.         |
| `map`        | Transforms the values of a configuration using a provided function.                                       |
| `mapAttempt` | Similar to `map`, but catches any errors thrown by the function and converts them into validation errors. |
| `mapOrFail`  | Like `map`, but the function can fail. If it does, the result is a validation error.                      |

**Example** (Using `validate` Operator)

```ts twoslash title="validate.ts"
import { Effect, Config } from "effect"

const program = Effect.gen(function* () {
  // Load the NAME environment variable and validate its length
  const config = yield* Config.string("NAME").pipe(
    Config.validate({
      message: "Expected a string at least 4 characters long",
      validation: (s) => s.length >= 4
    })
  )
  console.log(config)
})

Effect.runPromise(program)
```

If we run this program with an invalid `NAME` value:

```sh showLineNumbers=false
NAME=foo npx tsx validate.ts
```

The output will be:

```ansi showLineNumbers=false
[Error: (Invalid data at NAME: "Expected a string at least 4 characters long")] {
  name: '(FiberFailure) Error',
  [Symbol(effect/Runtime/FiberFailure)]: Symbol(effect/Runtime/FiberFailure),
  [Symbol(effect/Runtime/FiberFailure/Cause)]: {
    _tag: 'Fail',
    error: {
      _op: 'InvalidData',
      path: [ 'NAME' ],
      message: 'Expected a string at least 4 characters long'
    }
  }
}
```

### Fallback Operators

Fallback operators are useful when you want to provide alternative configurations in case of errors or missing data. These operators ensure that your program can still run even if some configuration values are unavailable.

| Operator   | Description                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `orElse`   | Attempts to use the primary config first. If it fails or is missing, it falls back to another config. |
| `orElseIf` | Similar to `orElse`, but it switches to the fallback config only if the error matches a condition.    |

**Example** (Using `orElse` for Fallback)

In this example, the program requires two configuration values: `A` and `B`. We set up two configuration providers, each containing only one of the required values. Using the `orElse` operator, we combine these providers so the program can retrieve both `A` and `B`.

```ts twoslash title="orElse.ts"
import { Config, ConfigProvider, Effect } from "effect"

// A program that requires two configurations: A and B
const program = Effect.gen(function* () {
  const A = yield* Config.string("A") // Retrieve config A
  const B = yield* Config.string("B") // Retrieve config B
  console.log(`A: ${A}, B: ${B}`)
})

// First provider has A but is missing B
const provider1 = ConfigProvider.fromMap(new Map([["A", "A"]]))

// Second provider has B but is missing A
const provider2 = ConfigProvider.fromMap(new Map([["B", "B"]]))

// Use `orElse` to fall back from provider1 to provider2
const provider = provider1.pipe(ConfigProvider.orElse(() => provider2))

Effect.runPromise(Effect.withConfigProvider(program, provider))
```

If we run this program:

```sh showLineNumbers=false
npx tsx orElse.ts
```

The output will be:

```ansi showLineNumbers=false
A: A, B: B
```

<Aside type="tip">
  In this example, we use `ConfigProvider.fromMap` to create a
  configuration provider from a simple JavaScript `Map`. This is
  particularly useful for testing, as described in the [Mocking
  Configurations in Tests](#mocking-configurations-in-tests) section.
</Aside>
