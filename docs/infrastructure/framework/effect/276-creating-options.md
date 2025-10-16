## Creating Options

### some

Use the `Option.some` constructor to create an `Option` that holds a value of type `A`.

**Example** (Creating an Option with a Value)

```ts twoslash
import { Option } from 'effect'

// An Option holding the number 1
const value = Option.some(1)

console.log(value)
// Output: { _id: 'Option', _tag: 'Some', value: 1 }
```

### none

Use the `Option.none` constructor to create an `Option` representing the absence of a value.

**Example** (Creating an Option with No Value)

```ts twoslash
import { Option } from 'effect'

// An Option holding no value
const noValue = Option.none()

console.log(noValue)
// Output: { _id: 'Option', _tag: 'None' }
```

### liftPredicate

You can create an `Option` based on a predicate, for example, to check if a value is positive.

**Example** (Using Explicit Option Creation)

Here's how you can achieve this using `Option.none` and `Option.some`:

```ts twoslash
import { Option } from 'effect'

const isPositive = (n: number) => n > 0

const parsePositive = (n: number): Option.Option<number> =>
  isPositive(n) ? Option.some(n) : Option.none()
```

**Example** (Using `Option.liftPredicate` for Conciseness)

Alternatively, you can simplify the above logic with `Option.liftPredicate`:

```ts twoslash
import { Option } from 'effect'

const isPositive = (n: number) => n > 0

//      ┌─── (b: number) => Option<number>
//      ▼
const parsePositive = Option.liftPredicate(isPositive)
```
