## Performance characteristics

Both `HashSet` and `MutableHashSet` offer similar average-time performance for core operations:

| Operation      | HashSet      | MutableHashSet | Description                     |
| -------------- | ------------ | -------------- | ------------------------------- |
| Lookup         | O(1) average | O(1) average   | Check if a value exists         |
| Insertion      | O(1) average | O(1) average   | Add a value                     |
| Removal        | O(1) average | O(1) average   | Remove a value                  |
| Iteration      | O(n)         | O(n)           | Iterate over all values         |
| Set operations | O(n)         | O(n)           | Union, intersection, difference |

The main difference is how updates are handled:

- **HashSet** returns a new set for each change. This can be slower if many changes are made in a row.
- **MutableHashSet** updates the same set in place. This is usually faster when performing many changes.
