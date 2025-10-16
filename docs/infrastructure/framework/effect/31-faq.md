## FAQ

### Bundle Size Comparison Between Effect and fp-ts

**Q: I compared the bundle sizes of two simple programs using Effect and fp-ts. Why does Effect have a larger bundle size?**

A: It's natural to observe different bundle sizes because Effect and fp-ts are distinct systems designed for different purposes.
Effect's bundle size is larger due to its included fiber runtime, which is crucial for its functionality.
While the initial bundle size may seem large, the overhead amortizes as you use Effect.

**Q: Should I be concerned about the bundle size difference when choosing between Effect and fp-ts?**

A: Not necessarily. Consider the specific requirements and benefits of each library for your project.

The **Micro** module in Effect is designed as a lightweight alternative to the standard `Effect` module, specifically for scenarios where reducing bundle size is crucial.
This module is self-contained and does not include more complex features like `Layer`, `Ref`, `Queue`, and `Deferred`.
If any major Effect modules (beyond basic data modules like `Option`, `Either`, `Array`, etc.) are used, the effect runtime will be added to your bundle, negating the benefits of Micro.
This makes Micro ideal for libraries that aim to implement Effect functionality with minimal impact on bundle size, especially for libraries that plan to expose `Promise`-based APIs.
It also supports scenarios where a client might use Micro while a server uses the full suite of Effect features, maintaining compatibility and shared logic between different parts of an application.
