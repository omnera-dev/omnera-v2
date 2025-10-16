## pipe

The `pipe` function is a utility that allows us to compose functions in a readable and sequential manner. It takes the output of one function and passes it as the input to the next function in the pipeline. This enables us to build complex transformations by chaining multiple functions together.

**Syntax**

```ts showLineNumbers=false
import { pipe } from "effect"

const result = pipe(input, func1, func2, ..., funcN)
```

In this syntax, `input` is the initial value, and `func1`, `func2`, ..., `funcN` are the functions to be applied in sequence. The result of each function becomes the input for the next function, and the final result is returned.

Here's an illustration of how `pipe` works:

```text showLineNumbers=false
┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌────────┐
│ input │───►│ func1 │───►│ func2 │───►│  ...  │───►│ funcN │───►│ result │
└───────┘    └───────┘    └───────┘    └───────┘    └───────┘    └────────┘
```

It's important to note that functions passed to `pipe` must have a **single argument** because they are only called with a single argument.

Let's see an example to better understand how `pipe` works:

**Example** (Chaining Arithmetic Operations)

```ts twoslash
import { pipe } from 'effect'

// Define simple arithmetic operations
const increment = (x: number) => x + 1
const double = (x: number) => x * 2
const subtractTen = (x: number) => x - 10

// Sequentially apply these operations using `pipe`
const result = pipe(5, increment, double, subtractTen)

console.log(result)
// Output: 2
```

In the above example, we start with an input value of `5`. The `increment` function adds `1` to the initial value, resulting in `6`. Then, the `double` function doubles the value, giving us `12`. Finally, the `subtractTen` function subtracts `10` from `12`, resulting in the final output of `2`.

The result is equivalent to `subtractTen(double(increment(5)))`, but using `pipe` makes the code more readable because the operations are sequenced from left to right, rather than nesting them inside out.
