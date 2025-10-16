## Type Aliases

In Effect, there are no predefined type aliases such as `UIO`, `URIO`, `RIO`, `Task`, or `IO` like in ZIO.

The reason for this is that type aliases are lost as soon as you compose them, which renders them somewhat useless unless you maintain **multiple** signatures for **every** function. In Effect, we have chosen not to go down this path. Instead, we utilize the `never` type to indicate unused types.

It's worth mentioning that the perception of type aliases being quicker to understand is often just an illusion. In Effect, the explicit notation `Effect<A>` clearly communicates that only type `A` is being used. On the other hand, when using a type alias like `RIO<R, A>`, questions arise about the type `E`. Is it `unknown`? `never`? Remembering such details becomes challenging.

# [Effect vs fp-ts](https://effect.website/docs/additional-resources/effect-vs-fp-ts/)
