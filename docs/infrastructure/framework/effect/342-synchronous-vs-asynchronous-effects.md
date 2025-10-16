## Synchronous vs. Asynchronous Effects

In the Effect library, there is no built-in way to determine in advance whether an effect will execute synchronously or asynchronously. While this idea was considered in earlier versions of Effect, it was ultimately not implemented for a few important reasons:

1. **Complexity:** Introducing this feature to track sync/async behavior in the type system would make Effect more complex to use and limit its composability.

2. **Safety Concerns:** We experimented with different approaches to track asynchronous Effects, but they all resulted in a worse developer experience without significantly improving safety. Even with fully synchronous types, we needed to support a `fromCallback` combinator to work with APIs using Continuation-Passing Style (CPS). However, at the type level, it's impossible to guarantee that such a function is always called immediately and not deferred.

### Best Practices for Running Effects

In most cases, effects are run at the outermost parts of your application. Typically, an application built around Effect will involve a single call to the main effect. Here’s how you should approach effect execution:

- Use `runPromise` or `runFork`: For most cases, asynchronous execution should be the default. These methods provide the best way to handle Effect-based workflows.

- Use `runSync` only when necessary: Synchronous execution should be considered an edge case, used only in scenarios where asynchronous execution is not feasible. For example, when you are sure the effect is purely synchronous and need immediate results.
