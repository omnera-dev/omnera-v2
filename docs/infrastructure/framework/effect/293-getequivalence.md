## getEquivalence

The `Redacted.getEquivalence` function generates an [Equivalence](/docs/behaviour/equivalence/) for `Redacted<A>` values using an Equivalence for the underlying values of type `A`. This allows you to compare `Redacted` values securely without revealing their content.

**Example** (Comparing Redacted Values)

```ts twoslash
import { Redacted, Equivalence } from 'effect'

const API_KEY1 = Redacted.make('1234567890')
const API_KEY2 = Redacted.make('1-34567890')
const API_KEY3 = Redacted.make('1234567890')

const equivalence = Redacted.getEquivalence(Equivalence.string)

console.log(equivalence(API_KEY1, API_KEY2))
// Output: false

console.log(equivalence(API_KEY1, API_KEY3))
// Output: true
```

# [Building Pipelines](https://effect.website/docs/getting-started/building-pipelines/)
