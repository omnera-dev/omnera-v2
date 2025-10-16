## Benefits

**Type Safe**

Every tool is fully described using Effect's `Schema`, including inputs, outputs, and descriptions.

**Effect Native**

Tool call behavior is defined using Effect, so they can leverage all the power of Effect. This is especially useful when you need to access other services to support the implementation of your tool call handlers.

**Injectable**

Because implementing the handlers for an `Toolkit` results in a `Layer`, providing alternate implementation of tool call handlers in different environments is as simple as providing a different `Layer` to your program.

**Separation of Concerns**

The definition of a tool call request is cleanly separated from both the implementation of the tool behavior, as well as the business logic that calls the model.

# [Equivalence](https://effect.website/docs/behaviour/equivalence/)
