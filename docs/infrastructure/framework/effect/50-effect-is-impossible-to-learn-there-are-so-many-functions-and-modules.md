## Effect is impossible to learn, there are so many functions and modules!

True, the full Effect ecosystem is quite large and some modules contain 1000s of functions, the reality is that you don't need to know them all to start being productive, you can safely start using Effect knowing just 10-20 functions and progressively discover the rest, just like you can start using TypeScript without knowing every single NPM package.

A short list of commonly used functions to begin are:

- [Effect.succeed](/docs/getting-started/creating-effects/#succeed)
- [Effect.fail](/docs/getting-started/creating-effects/#fail)
- [Effect.sync](/docs/getting-started/creating-effects/#sync)
- [Effect.tryPromise](/docs/getting-started/creating-effects/#trypromise)
- [Effect.gen](/docs/getting-started/using-generators/)
- [Effect.runPromise](/docs/getting-started/running-effects/#runpromise)
- [Effect.catchTag](/docs/error-management/expected-errors/#catchtag)
- [Effect.catchAll](/docs/error-management/expected-errors/#catchall)
- [Effect.acquireRelease](/docs/resource-management/scope/#acquirerelease)
- [Effect.acquireUseRelease](/docs/resource-management/introduction/#acquireuserelease)
- [Effect.provide](/docs/requirements-management/layers/#providing-a-layer-to-an-effect)
- [Effect.provideService](/docs/requirements-management/services/#providing-a-service-implementation)
- [Effect.andThen](/docs/getting-started/building-pipelines/#andthen)
- [Effect.map](/docs/getting-started/building-pipelines/#map)
- [Effect.tap](/docs/getting-started/building-pipelines/#tap)

A short list of commonly used modules:

- [Effect](https://effect-ts.github.io/effect/effect/Effect.ts.html)
- [Context](/docs/requirements-management/services/#creating-a-service)
- [Layer](/docs/requirements-management/layers/)
- [Option](/docs/data-types/option/)
- [Either](/docs/data-types/either/)
- [Array](https://effect-ts.github.io/effect/effect/Array.ts.html)
- [Match](/docs/code-style/pattern-matching/)
