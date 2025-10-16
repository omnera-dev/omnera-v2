## Understanding `Model`

The `Model` data type represents a **provider-specific implementation** of one or more services, such as `LanguageModel` or `EmbeddingsModel`. It is the primary way that you can plug a real large language model into your program.

```ts showLineNumbers=false
export interface Model<ProviderName, Provides, Requires> {}
```

An `Model` has three generic type parameters:

- **ProviderName** - the name of the large language model provider that will be used
- **Provides** - the services this model will provide when built
- **Requires** - the services this model will require to be built

This allows Effect to track which services the `Model` requires as well as which services the `Model` will provide.

### Creating n `Model`

To create a `Model`, you can use the model-specific factory from one of Effect's provider integration packages.

**Example** (Defining a `Model` to Interact with OpenAI)

```ts showLineNumbers=false
import { OpenAiLanguageModel } from "@effect/ai-openai"

//      ┌─── Model<"openai", LanguageModel | ProviderName, OpenAiClient>
//      ▼
const Gpt4o = OpenAiLanguageModel.model("gpt-4o")
```

This creates a `Model` that:

- **Provides** the `ProviderName` service, which allows introspection of the current provider in use by the program
- **Provides** an OpenAI-specific implementation of the `LanguageModel` service using `"gpt-4o"`
- **Requires** an `OpenAiClient` to be built

### Providing a `Model`

Once you've created a `Model`, you can directly `Effect.provide` it to your Effect programs just like any other service:

```ts
import { OpenAiLanguageModel } from "@effect/ai-openai"
import { LanguageModel } from "@effect/ai"

//      ┌─── Model<"openai", LanguageModel | ProviderName, OpenAiClient>
//      ▼
const Gpt4o = OpenAiLanguageModel.model("gpt-4o")

//       ┌─── Effect<GenerateTextResponse<{}>, AiError, OpenAiClient>
//       ▼
const program = LanguageModel.generateText({
  prompt: "Generate a dad joke"
}).pipe(Effect.provide(Gpt4o))
```

### Benefits of `Model`

There are several benefits to this approach:

**Reusability**

You can provide the same `Model` to as many programs as you like.

**Example** (Providing a `Model` to Multiple Programs)

```ts twoslash {18-20} collapse={5-11}
import { OpenAiLanguageModel } from "@effect/ai-openai"
import { LanguageModel } from "@effect/ai"
import { Effect } from "effect"

const generateDadJoke = Effect.gen(function*() {
  const response = yield* LanguageModel.generateText({
    prompt: "Generate a dad joke"
  })
  console.log(response.text)
  return response
})

const Gpt4o = OpenAiLanguageModel.model("gpt-4o")

const main = Effect.gen(function*() {
  // You can provide the `Model` individually to each
  // program, or to all of them at once (as we do here)
  const res1 = yield* generateDadJoke
  const res2 = yield* generateDadJoke
  const res3 = yield* generateDadJoke
}).pipe(Effect.provide(Gpt4o))
```

**Flexibility**

If we know that one model or provider performs better at a given task than another, we can freely mix and match models and providers together.

For example, if we know Anthropic's Claude generates some really great dad jokes, we can mix it into our existing program with just a few lines of code:

**Example** (Mixing Multiple Providers and Models)

```ts twoslash {24} collapse={6-12}
import { AnthropicLanguageModel } from "@effect/ai-anthropic"
import { OpenAiLanguageModel } from "@effect/ai-openai"
import { LanguageModel } from "@effect/ai"
import { Effect } from "effect"

const generateDadJoke = Effect.gen(function*() {
  const response = yield* LanguageModel.generateText({
    prompt: "Generate a dad joke"
  })
  console.log(response.text)
  return response
})

const Gpt4o = OpenAiLanguageModel.model("gpt-4o")
const Claude37 = AnthropicLanguageModel.model("claude-3-7-sonnet-latest")

//      ┌─── Effect<void, AiError, AnthropicClient | OpenAiClient>
//      ▼
const main = Effect.gen(function*() {
  const res1 = yield* generateDadJoke
  const res2 = yield* generateDadJoke
  const res3 = yield* Effect.provide(generateDadJoke, Claude37)
}).pipe(Effect.provide(Gpt4o))
```

Because Effect performs type-level dependency tracking, we can see that an `AnthropicClient` is now required to make our program runnable.

**Abstractability**

An `Model` can also be `yield*`'ed to lift its dependencies into the calling Effect. This is particularly useful when creating services that depend on AI interactions, where you want to avoid leaking service-level dependencies into the service interface.

For example, in the code below the `main` program is only dependent upon the `DadJokes` service. All AI requirements are abstracted away into `Layer` composition.

**Example** (Abstracting LLM Interactions into a Service)

```ts twoslash collapse={18-24}
import { AnthropicLanguageModel } from "@effect/ai-anthropic"
import { OpenAiLanguageModel } from "@effect/ai-openai"
import { LanguageModel } from "@effect/ai"
import { Effect } from "effect"

const Gpt4o = OpenAiLanguageModel.model("gpt-4o")
const Claude37 = AnthropicLanguageModel.model("claude-3-7-sonnet-latest")

class DadJokes extends Effect.Service<DadJokes>()("app/DadJokes", {
  effect: Effect.gen(function*() {
    // Yielding the model will return a layer with no requirements
    //
    //     ┌─── Layer<LanguageModel | ProviderName>
    //     ▼
    const gpt = yield* Gpt4o
    const claude = yield* Claude37

    const generateDadJoke = Effect.gen(function*() {
      const response = yield* LanguageModel.generateText({
        prompt: "Generate a dad joke"
      })
      console.log(response.text)
      return response
    })

    return {
      generateDadJoke: Effect.provide(generateDadJoke, gpt),
      generateBetterDadJoke: Effect.provide(generateDadJoke, claude)
    }
  })
}) {}

// Programs which utilize the `DadJokes` service have no knowledge of
// any AI requirements
//
//     ┌─── Effect<void, AiError, DadJokes>
//     ▼
const main = Effect.gen(function*() {
  const dadJokes = yield* DadJokes
  const res1 = yield* dadJokes.generateDadJoke
  const res2 = yield* dadJokes.generateBetterDadJoke
})

// The AI requirements are abstracted away into `Layer` composition
//
//         ┌─── Layer<DadJokes, never, AnthropicClient | OpenAiClient>
//         ▼
DadJokes.Default
```
