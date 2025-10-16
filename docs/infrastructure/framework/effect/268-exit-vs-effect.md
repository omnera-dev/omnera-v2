## Exit vs Effect

`Exit` is actually a subtype of `Effect`. This means that `Exit` values can also be considered as `Effect` values.

- An `Exit`, in essence, is a "constant computation".
- `Effect.succeed` is essentially the same as `Exit.succeed`.
- `Effect.failCause` is the same as `Exit.failCause`.

# [HashSet](https://effect.website/docs/data-types/hash-set/)
