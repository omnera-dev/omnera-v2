## Overview

import { Aside } from "@astrojs/starlight/components"

A HashSet represents an **unordered** collection of **unique** values with efficient lookup, insertion and removal operations.

The Effect library provides two versions of this structure:

- [HashSet](/docs/data-types/hash-set/#hashset) - Immutable
- [MutableHashSet](/docs/data-types/hash-set/#mutablehashset) - Mutable

Both versions provide constant-time operations on average. The main difference is how they handle changes: one returns new sets, the other modifies the original.

### Why use HashSet?

HashSet solves the problem of maintaining an **unsorted collection where each value appears exactly once**, with fast operations for checking membership and adding/removing values.

Some common use cases include:

- Tracking unique items (e.g., users who have completed an action)
- Efficiently testing for membership in a collection
- Performing set operations like union, intersection, and difference
- Eliminating duplicates from a collection

### When to use HashSet Instead of other collections

Choose HashSet (either variant) over other collections when:

- You need to ensure elements are unique
- You frequently need to check if an element exists in the collection
- You need to perform set operations like union, intersection, and difference
- The order of elements doesn't matter to your use case

Choose other collections when:

- You need to maintain insertion order (use `List` or `Array`)
- You need key-value associations (use `HashMap` or `MutableHashMap`)
- You need to frequently access elements by index (use `Array`)

### Choosing between immutable and mutable variants

Effect offers both immutable and mutable versions to support different coding styles and performance needs.

**HashSet**

This version never modifies the original set. Instead, it returns a new set for every change.

Characteristics:

- Operations return new instances instead of modifying the original
- Previous states are preserved
- Thread-safe by design
- Ideal for functional programming patterns
- Suitable for sharing across different parts of your application

**MutableHashSet**

This version allows direct updates: adding and removing values changes the set in place.

Characteristics:

- Operations modify the original set directly
- More efficient when building sets incrementally
- Requires careful handling to avoid unexpected side effects
- Better performance in scenarios with many modifications
- Ideal for localized use where mutations won't cause issues elsewhere

### When to use each variant

Use **HashSet** when:

- You need predictable behavior with no side effects
- You want to preserve previous states of your data
- You're sharing sets across different parts of your application
- You prefer functional programming patterns
- You need fiber safety in concurrent environments

Use **MutableHashSet** when:

- Performance is critical, and you need to avoid creating new instances
- You're building a collection incrementally with many additions/removals
- You're working in a controlled scope where mutation is safe
- You need to optimize memory usage in performance-critical code

### Hybrid approach

You can apply multiple updates to a `HashSet` in a temporary mutable context using `HashSet.mutate`. This allows you to perform several changes at once without modifying the original set.

**Example** (Batching changes without mutating the original)

```ts twoslash
import { HashSet } from 'effect'

// Create an immutable HashSet
const original = HashSet.make(1, 2, 3)

// Apply several updates inside a temporary mutable draft
const modified = HashSet.mutate(original, (draft) => {
  HashSet.add(draft, 4)
  HashSet.add(draft, 5)
  HashSet.remove(draft, 1)
})

console.log(HashSet.toValues(original))
// Output: [1, 2, 3] - original remains unchanged

console.log(HashSet.toValues(modified))
// Output: [2, 3, 4, 5] - changes applied to a new version
```
