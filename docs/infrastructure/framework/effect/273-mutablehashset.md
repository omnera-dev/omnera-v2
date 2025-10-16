## MutableHashSet

A `MutableHashSet<A>` is a **mutable**, **unordered** collection of **unique** values.
Unlike `HashSet`, it allows direct modifications, operations like `add`, `remove`, and `clear` update the original set instead of returning a new one.

This mutability can improve performance when you need to build or update a set repeatedly, especially within a local or isolated scope.

### Operations

| Category     | Operation                                                                                     | Description                         | Complexity |
| ------------ | --------------------------------------------------------------------------------------------- | ----------------------------------- | ---------- |
| constructors | [empty](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#empty)               | Creates an empty MutableHashSet     | O(1)       |
| constructors | [fromIterable](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#fromiterable) | Creates a set from an iterable      | O(n)       |
| constructors | [make](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#make)                 | Creates a set from multiple values  | O(n)       |
| elements     | [has](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#has)                   | Checks if a value exists in the set | O(1) avg   |
| elements     | [add](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#add)                   | Adds a value to the set             | O(1) avg   |
| elements     | [remove](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#remove)             | Removes a value from the set        | O(1) avg   |
| getters      | [size](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#size)                 | Gets the number of elements         | O(1)       |
| mutations    | [clear](https://effect-ts.github.io/effect/effect/MutableHashSet.ts.html#clear)               | Removes all values from the set     | O(1)       |

**Example** (Working with a mutable set)

```ts twoslash
import { MutableHashSet } from 'effect'

// Create a mutable set with initial values
const set = MutableHashSet.make(1, 2, 3)

// Add a new element (updates the set in place)
MutableHashSet.add(set, 4)

// Check current contents
console.log([...set])
// Output: [1, 2, 3, 4]

// Remove an element (modifies in place)
MutableHashSet.remove(set, 1)

console.log([...set])
// Output: [2, 3, 4]

// Clear the set entirely
MutableHashSet.clear(set)

console.log(MutableHashSet.size(set))
// Output: 0
```
