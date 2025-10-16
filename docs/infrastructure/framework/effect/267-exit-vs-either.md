## Exit vs Either

Conceptually, `Exit<A, E>` can be thought of as `Either<A, Cause<E>>`. However, the [Cause](/docs/data-types/cause/) type represents more than just expected errors of type `E`. It includes:

- Interruption causes
- Defects (unexpected errors)
- The combination of multiple causes

This allows `Cause` to capture richer and more complex error states compared to a simple `Either`.
