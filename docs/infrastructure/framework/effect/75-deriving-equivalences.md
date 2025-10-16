## Deriving Equivalences

For more complex data structures, you may need custom equivalences. The Equivalence module lets you derive new `Equivalence` instances from existing ones with the `Equivalence.mapInput` function.

**Example** (Creating a Custom Equivalence for Objects)

```ts twoslash
import { Equivalence } from 'effect'

interface User {
  readonly id: number
  readonly name: string
}

// Create an equivalence that compares User objects based only on the id
const equivalence = Equivalence.mapInput(
  Equivalence.number, // Base equivalence for comparing numbers
  (user: User) => user.id // Function to extract the id from a User
)

// Compare two User objects: they are equivalent if their ids are the same
console.log(equivalence({ id: 1, name: 'Alice' }, { id: 1, name: 'Al' }))
// Output: true
```

The `Equivalence.mapInput` function takes two arguments:

1. The existing `Equivalence` you want to use as a base (`Equivalence.number` in this case, for comparing numbers).
2. A function that extracts the value used for the equivalence check from your data structure (`(user: User) => user.id` in this case).

# [Order](https://effect.website/docs/behaviour/order/)
