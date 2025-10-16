## HashSet

A `HashSet<A>` is an **immutable**, **unordered** collection of **unique** values.
It guarantees that each value appears only once and supports fast operations like lookup, insertion, and removal.

Any operation that would modify the set (like adding or removing a value) returns a new `HashSet`, leaving the original unchanged.

### Operations

| Category     | Operation                                                                              | Description                                 | Time Complexity |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------- | --------------- |
| constructors | [empty](https://effect-ts.github.io/effect/effect/HashSet.ts.html#empty)               | Creates an empty HashSet                    | O(1)            |
| constructors | [fromIterable](https://effect-ts.github.io/effect/effect/HashSet.ts.html#fromiterable) | Creates a HashSet from an iterable          | O(n)            |
| constructors | [make](https://effect-ts.github.io/effect/effect/HashSet.ts.html#make)                 | Creates a HashSet from multiple values      | O(n)            |
| elements     | [has](https://effect-ts.github.io/effect/effect/HashSet.ts.html#has)                   | Checks if a value exists in the set         | O(1) avg        |
| elements     | [some](https://effect-ts.github.io/effect/effect/HashSet.ts.html#some)                 | Checks if any element satisfies a predicate | O(n)            |
| elements     | [every](https://effect-ts.github.io/effect/effect/HashSet.ts.html#every)               | Checks if all elements satisfy a predicate  | O(n)            |
| elements     | [isSubset](https://effect-ts.github.io/effect/effect/HashSet.ts.html#issubset)         | Checks if a set is a subset of another      | O(n)            |
| getters      | [values](https://effect-ts.github.io/effect/effect/HashSet.ts.html#values)             | Gets an `Iterator` of all values            | O(1)            |
| getters      | [toValues](https://effect-ts.github.io/effect/effect/HashSet.ts.html#tovalues)         | Gets an `Array` of all values               | O(n)            |
| getters      | [size](https://effect-ts.github.io/effect/effect/HashSet.ts.html#size)                 | Gets the number of elements                 | O(1)            |
| mutations    | [add](https://effect-ts.github.io/effect/effect/HashSet.ts.html#add)                   | Adds a value to the set                     | O(1) avg        |
| mutations    | [remove](https://effect-ts.github.io/effect/effect/HashSet.ts.html#remove)             | Removes a value from the set                | O(1) avg        |
| mutations    | [toggle](https://effect-ts.github.io/effect/effect/HashSet.ts.html#toggle)             | Toggles a value's presence                  | O(1) avg        |
| operations   | [difference](https://effect-ts.github.io/effect/effect/HashSet.ts.html#difference)     | Computes set difference (A - B)             | O(n)            |
| operations   | [intersection](https://effect-ts.github.io/effect/effect/HashSet.ts.html#intersection) | Computes set intersection (A ∩ B)           | O(n)            |
| operations   | [union](https://effect-ts.github.io/effect/effect/HashSet.ts.html#union)               | Computes set union (A ∪ B)                  | O(n)            |
| mapping      | [map](https://effect-ts.github.io/effect/effect/HashSet.ts.html#map)                   | Transforms each element                     | O(n)            |
| sequencing   | [flatMap](https://effect-ts.github.io/effect/effect/HashSet.ts.html#flatmap)           | Transforms and flattens elements            | O(n)            |
| traversing   | [forEach](https://effect-ts.github.io/effect/effect/HashSet.ts.html#foreach)           | Applies a function to each element          | O(n)            |
| folding      | [reduce](https://effect-ts.github.io/effect/effect/HashSet.ts.html#reduce)             | Reduces the set to a single value           | O(n)            |
| filtering    | [filter](https://effect-ts.github.io/effect/effect/HashSet.ts.html#filter)             | Keeps elements that satisfy a predicate     | O(n)            |
| partitioning | [partition](https://effect-ts.github.io/effect/effect/HashSet.ts.html#partition)       | Splits into two sets by a predicate         | O(n)            |

**Example** (Basic creation and operations)

```ts twoslash
import { HashSet } from 'effect'

// Create an initial set with 3 values
const set1 = HashSet.make(1, 2, 3)

// Add a value (returns a new set)
const set2 = HashSet.add(set1, 4)

// The original set is unchanged
console.log(HashSet.toValues(set1))
// Output: [1, 2, 3]

console.log(HashSet.toValues(set2))
// Output: [1, 2, 3, 4]

// Perform set operations with another set
const set3 = HashSet.make(3, 4, 5)

// Combine both sets
const union = HashSet.union(set2, set3)

console.log(HashSet.toValues(union))
// Output: [1, 2, 3, 4, 5]

// Shared values
const intersection = HashSet.intersection(set2, set3)

console.log(HashSet.toValues(intersection))
// Output: [3, 4]

// Values only in set2
const difference = HashSet.difference(set2, set3)

console.log(HashSet.toValues(difference))
// Output: [1, 2]
```

**Example** (Chaining with `pipe`)

```ts twoslash
import { HashSet, pipe } from 'effect'

const result = pipe(
  // Duplicates are ignored
  HashSet.make(1, 2, 2, 3, 4, 5, 5),
  // Keep even numbers
  HashSet.filter((n) => n % 2 === 0),
  // Double each value
  HashSet.map((n) => n * 2),
  // Convert to array
  HashSet.toValues
)

console.log(result)
// Output: [4, 8]
```
