## Equivalence

You can compare `Option` values using the `Option.getEquivalence` function. This function allows you to specify how to compare the contents of `Option` types by providing an [Equivalence](/docs/behaviour/equivalence/) for the type of value they may contain.

**Example** (Comparing Optional Numbers for Equivalence)

Suppose you have optional numbers and want to check if they are equivalent. Here's how you can use `Option.getEquivalence`:

```ts twoslash
import { Option, Equivalence } from 'effect'

const myEquivalence = Option.getEquivalence(Equivalence.number)

console.log(myEquivalence(Option.some(1), Option.some(1)))
// Output: true, both options contain the number 1

console.log(myEquivalence(Option.some(1), Option.some(2)))
// Output: false, the numbers are different

console.log(myEquivalence(Option.some(1), Option.none()))
// Output: false, one is a number and the other is empty
```
