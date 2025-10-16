## Creating a Service

To create a new service, you need two things:

1. A unique **identifier**.
2. A **type** describing the possible operations of the service.

**Example** (Defining a Random Number Generator Service)

Let's create a service for generating random numbers.

1. **Identifier**. We'll use the string `"MyRandomService"` as the unique identifier.
2. **Type**. The service type will have a single operation called `next` that returns a random number.

```ts twoslash
import { Effect, Context } from "effect"

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag("MyRandomService")<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}
```

The exported `Random` value is known as a **tag** in Effect. It acts as a representation of the service and allows Effect to locate and use this service at runtime.

The service will be stored in a collection called `Context`, which can be thought of as a `Map` where the keys are tags and the values are services:

```ts showLineNumbers=false
type Context = Map<Tag, Service>
```

<Aside type="note" title="Why Use Identifiers?">
  You need to specify an identifier to make the tag global. This ensures that two tags with the same identifier refer to the same instance.

Using a unique identifier is particularly useful in scenarios where live reloads can occur, as it helps preserve the instance across reloads. It ensures there is no duplication of instances (although it shouldn't happen, some bundlers and frameworks can behave unpredictably).

</Aside>

Let's summarize the concepts we've covered so far:

| Concept     | Description                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| **service** | A reusable component providing specific functionality, used across different parts of an application.  |
| **tag**     | A unique identifier representing a **service**, allowing Effect to locate and use it.                  |
| **context** | A collection storing service, functioning like a map with **tags** as keys and **services** as values. |
