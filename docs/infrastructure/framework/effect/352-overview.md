## Overview

import { Aside } from "@astrojs/starlight/components"

The `Effect` type is a description of a workflow or operation that is **lazily** executed. This means that when you create an `Effect`, it doesn't run immediately, but instead defines a program that can succeed, fail, or require some additional context to complete.

Here is the general form of an `Effect`:

```text showLineNumbers=false
         ┌─── Represents the success type
         │        ┌─── Represents the error type
         │        │      ┌─── Represents required dependencies
         ▼        ▼      ▼
Effect<Success, Error, Requirements>
```

This type indicates that an effect:

- Succeeds and returns a value of type `Success`
- Fails with an error of type `Error`
- May need certain contextual dependencies of type `Requirements` to execute

Conceptually, you can think of `Effect` as an effectful version of the following function type:

```ts showLineNumbers=false
type Effect<Success, Error, Requirements> = (context: Context<Requirements>) => Error | Success
```

However, effects are not actually functions. They can model synchronous, asynchronous, concurrent, and resourceful computations.

**Immutability**. `Effect` values are immutable, and every function in the Effect library produces a new `Effect` value.

**Modeling Interactions**. These values do not perform any actions themselves, they simply model or describe effectful interactions.

**Execution**. An `Effect` can be executed by the [Effect Runtime System](/docs/runtime/), which interprets it into actual interactions with the external world.
Ideally, this execution happens at a single entry point in your application, such as the main function where effectful operations are initiated.
