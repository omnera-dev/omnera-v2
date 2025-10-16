## Effect is the same as RxJS and shares its problems

This is a sensitive topic, let's start by saying that RxJS is a great project and that it has helped millions of developers write reliable software and we all should be thankful to the developers who contributed to such an amazing project.

Discussing the scope of the projects, RxJS aims to make working with Observables easy and wants to provide reactive extensions to JS, Effect instead wants to make writing production-grade TypeScript easy. While the intersection is non-empty the projects have fundamentally different objectives and strategies.

Sometimes people refer to RxJS in bad light, and the reason isn't RxJS in itself but rather usage of RxJS in problem domains where RxJS wasn't thought to be used.

Namely the idea that "everything is a stream" is theoretically true but it leads to fundamental limitations on developer experience, the primary issue being that streams are multi-shot (emit potentially multiple elements, or zero) and mutable delimited continuations (JS Generators) are known to be only good to represent single-shot effects (that emit a single value).

In short it means that writing in imperative style (think of async/await) is practically impossible with stream primitives (practically because there would be the option of replaying the generator at every element and at every step, but this tends to be inefficient and the semantics of it are counter-intuitive, it would only work under the assumption that the full body is free of side-effects), forcing the developer to use declarative approaches such as pipe to represent all of their code.

Effect has a Stream module (which is pull-based instead of push-based in order to be memory constant), but the basic Effect type is single-shot and it is optimised to act as a smart & lazy Promise that enables imperative programming, so when using Effect you're not forced to use a declarative style for everything and you can program using a model which is similar to async-await.

The other big difference is that RxJS only cares about the happy-path with explicit types, it doesn't offer a way of typing errors and dependencies, Effect instead consider both errors and dependencies as explicitely typed and offers control-flow around those in a fully type-safe manner.

In short if you need reactive programming around Observables, use RxJS, if you need to write production-grade TypeScript that includes by default native telemetry, error handling, dependency injection, and more use Effect.
