## Embracing Control Flow

One significant advantage of using `Effect.gen` in conjunction with generators is its capability to employ standard control flow constructs within the generator function. These constructs include `if`/`else`, `for`, `while`, and other branching and looping mechanisms, enhancing your ability to express complex control flow logic in your code.

**Example** (Using Control Flow)

```ts twoslash
import { Effect } from 'effect'

const calculateTax = (amount: number, taxRate: number): Effect.Effect<number, Error> =>
  taxRate > 0
    ? Effect.succeed((amount * taxRate) / 100)
    : Effect.fail(new Error('Invalid tax rate'))

const program = Effect.gen(function* () {
  let i = 1

  while (true) {
    if (i === 10) {
      break // Break the loop when counter reaches 10
    } else {
      if (i % 2 === 0) {
        // Calculate tax for even numbers
        console.log(yield* calculateTax(100, i))
      }
      i++
      continue
    }
  }
})

Effect.runPromise(program)
/*
Output:
2
4
6
8
*/
```
