## Methods

In addition to `get`, the cache provides several other methods:

| Method          | Description                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `refresh`       | Triggers a recomputation of the value for a key without removing the old value, allowing continued access.                                                                 |
| `size`          | Returns the current size of the cache. The size is approximate under concurrent conditions.                                                                                |
| `contains`      | Checks if a value associated with a specified key exists in the cache. Under concurrent access, the result is valid as of the check time but may change immediately after. |
| `invalidate`    | Evicts the value associated with a specific key.                                                                                                                           |
| `invalidateAll` | Evicts all values from the cache.                                                                                                                                          |

# [Caching Effects](https://effect.website/docs/caching/caching-effects/)
