## Working with Collections

JavaScript's built-in `Set` and `Map` can be a bit tricky when it comes to checking equality:

**Example** (Native `Set` with Reference-Based Equality)

```ts twoslash
const set = new Set()

// Adding two objects with the same content to the set
set.add({ name: 'Alice', age: 30 })
set.add({ name: 'Alice', age: 30 })

// Even though the objects have identical values, they are treated
// as different elements because JavaScript compares objects by reference,
// not by value.
console.log(set.size)
// Output: 2
```

Even though the two elements in the set have the same values, the set contains two elements. Why? JavaScript's `Set` checks for equality by reference, not by values.

To perform value-based equality checks, you'll need to use the `Hash*` collection types available in the `effect` package. These collection types, such as [HashSet](https://effect-ts.github.io/effect/effect/HashSet.ts.html) and [HashMap](https://effect-ts.github.io/effect/effect/HashMap.ts.html), provide support for the `Equal` interface.

### HashSet

When you use the `HashSet`, it correctly handles value-based equality checks. In the following example, even though you're adding two objects with the same values, the `HashSet` treats them as a single element.

**Example** (Using `HashSet` for Value-Based Equality)

```ts twoslash
import { HashSet, Data } from 'effect'

// Creating a HashSet with objects that implement the Equal interface
const set = HashSet.empty().pipe(
  HashSet.add(Data.struct({ name: 'Alice', age: 30 })),
  HashSet.add(Data.struct({ name: 'Alice', age: 30 }))
)

// HashSet recognizes them as equal, so only one element is stored
console.log(HashSet.size(set))
// Output: 1
```

**Note**: It's crucial to use elements that implement the `Equal` interface, either by implementing custom equality checks or by using the Data module. This ensures proper functionality when working with `HashSet`. Without this, you'll encounter the same behavior as the native `Set` data type:

**Example** (Reference-Based Equality in `HashSet`)

```ts twoslash
import { HashSet } from 'effect'

// Creating a HashSet with objects that do NOT implement
// the Equal interface
const set = HashSet.empty().pipe(
  HashSet.add({ name: 'Alice', age: 30 }),
  HashSet.add({ name: 'Alice', age: 30 })
)

// Since these objects are compared by reference,
// HashSet considers them different
console.log(HashSet.size(set))
// Output: 2
```

In this case, without using the Data module alongside `HashSet`, you'll experience the same behavior as the native `Set` data type. The set contains two elements because it checks for equality by reference, not by values.

### HashMap

When working with the `HashMap`, you have the advantage of comparing keys by their values instead of their references. This is particularly helpful in scenarios where you want to associate values with keys based on their content.

**Example** (Value-Based Key Comparisons with `HashMap`)

```ts twoslash
import { HashMap, Data } from 'effect'

// Adding two objects with identical values as keys
const map = HashMap.empty().pipe(
  HashMap.set(Data.struct({ name: 'Alice', age: 30 }), 1),
  HashMap.set(Data.struct({ name: 'Alice', age: 30 }), 2)
)

console.log(HashMap.size(map))
// Output: 1

// Retrieve the value associated with a key
console.log(HashMap.get(map, Data.struct({ name: 'Alice', age: 30 })))
/*
Output:
{ _id: 'Option', _tag: 'Some', value: 2 }
*/
```

In this code snippet, `HashMap` is used to create a map where the keys are objects constructed with `Data.struct`. These objects contain identical values, which would usually create separate entries in a regular JavaScript `Map` because the default comparison is reference-based.

`HashMap`, however, uses value-based comparison, meaning the two objects with identical content are treated as the same key. Thus, when we add both objects, the second key-value pair overrides the first, resulting in a single entry in the map.

# [Hash](https://effect.website/docs/trait/hash/)
