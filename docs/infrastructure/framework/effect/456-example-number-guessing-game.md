## Example: Number guessing game

This example demonstrates how to create a complete number-guessing game by reading input from the terminal and providing feedback to the user. The game continues until the user guesses the correct number.

**Example** (Interactive Number Guessing Game)

```ts twoslash
import { Terminal } from "@effect/platform"
import type { PlatformError } from "@effect/platform/Error"
import { Effect, Option, Random } from "effect"
import { NodeRuntime, NodeTerminal } from "@effect/platform-node"

// Generate a secret random number between 1 and 100
const secret = Random.nextIntBetween(1, 100)

// Parse the user's input into a valid number
const parseGuess = (input: string) => {
  const n = parseInt(input, 10)
  return isNaN(n) || n < 1 || n > 100 ? Option.none() : Option.some(n)
}

// Display a message on the terminal
const display = (message: string) =>
  Effect.gen(function* () {
    const terminal = yield* Terminal.Terminal
    yield* terminal.display(`${message}\n`)
  })

// Prompt the user for a guess
const prompt = Effect.gen(function* () {
  const terminal = yield* Terminal.Terminal
  yield* terminal.display("Enter a guess: ")
  return yield* terminal.readLine
})

// Get the user's guess, validating it as an integer between 1 and 100
const answer: Effect.Effect<
  number,
  Terminal.QuitException | PlatformError,
  Terminal.Terminal
> = Effect.gen(function* () {
  const input = yield* prompt
  const guess = parseGuess(input)
  if (Option.isNone(guess)) {
    yield* display("You must enter an integer from 1 to 100")
    return yield* answer
  }
  return guess.value
})

// Check if the guess is too high, too low, or correct
const check = <A, E, R>(
  secret: number,
  guess: number,
  ok: Effect.Effect<A, E, R>,
  ko: Effect.Effect<A, E, R>
) =>
  Effect.gen(function* () {
    if (guess > secret) {
      yield* display("Too high")
      return yield* ko
    } else if (guess < secret) {
      yield* display("Too low")
      return yield* ko
    } else {
      return yield* ok
    }
  })

// End the game with a success message
const end = display("You guessed it!")

// Main game loop
const loop = (
  secret: number
): Effect.Effect<
  void,
  Terminal.QuitException | PlatformError,
  Terminal.Terminal
> =>
  Effect.gen(function* () {
    const guess = yield* answer
    return yield* check(
      secret,
      guess,
      end,
      Effect.suspend(() => loop(secret))
    )
  })

// Full game setup and execution
const game = Effect.gen(function* () {
  yield* display(
    `We have selected a random number between 1 and 100.
See if you can guess it in 10 turns or fewer.
We'll tell you if your guess was too high or too low.`
  )
  yield* loop(yield* secret)
})

// Run the game
NodeRuntime.runMain(game.pipe(Effect.provide(NodeTerminal.layer)))
```

# [Default Services](https://effect.website/docs/requirements-management/default-services/)
