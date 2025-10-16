## Comparing Effects and Promises: Key Distinctions

- **Evaluation Strategy:** Promises are eagerly evaluated, whereas effects are lazily evaluated.
- **Execution Mode:** Promises are one-shot, executing once, while effects are multi-shot, repeatable.
- **Interruption Handling and Automatic Propagation:** Promises lack built-in interruption handling, posing challenges in managing interruptions, and don't automatically propagate interruptions, requiring manual abort controller management. In contrast, effects come with interruption handling capabilities and automatically compose interruption, simplifying management locally on smaller computations without the need for high-level orchestration.
- **Structured Concurrency:** Effects offer structured concurrency built-in, which is challenging to achieve with Promises.
- **Error Reporting (Type Safety):** Promises don't inherently provide detailed error reporting at the type level, whereas effects do, offering type-safe insight into error cases.
- **Runtime Behavior:** The Effect runtime aims to remain synchronous as long as possible, transitioning into asynchronous mode only when necessary due to computation requirements or main thread starvation.
