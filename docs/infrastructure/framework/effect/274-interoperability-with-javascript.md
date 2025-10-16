## Interoperability with JavaScript

Both `HashSet` and `MutableHashSet` implement the `Iterable` interface, so you can use them with JavaScript features like:

- the spread operator (`...`)
- `for...of` loops
- `Array.from`

You can also extract values as an array using `.toValues`.

**Example** (Using HashSet values in JS-native ways)

```ts twoslash
import { HashSet, MutableHashSet } from 'effect'

// Immutable HashSet
const hashSet = HashSet.make(1, 2, 3)

// Mutable variant
const mutableSet = MutableHashSet.make(4, 5, 6)

// Convert HashSet to an iterator
//
//      ┌─── IterableIterator<number>
//      ▼
const iterable = HashSet.values(hashSet)

// Spread into console.log
console.log(...iterable)
// Output: 1 2 3

// Use in a for...of loop
for (const value of mutableSet) {
  console.log(value)
}
// Output: 4 5 6

// Convert to array with Array.from
console.log(Array.from(mutableSet))
// Output: [ 4, 5, 6 ]

// Convert immutable HashSet to array using toValues
//
//      ┌─── Array<number>
//      ▼
const array = HashSet.toValues(hashSet)

console.log(array)
// Output: [ 1, 2, 3 ]
```

<Aside type="caution" title="Performance considerations">
  Avoid repeatedly converting between `HashSet` and JavaScript arrays in
  hot paths or large collections. These operations involve copying data
  and can impact memory and speed.
</Aside>

# [Option](https://effect.website/docs/data-types/option/)
