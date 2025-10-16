## Adding Fallback Models

To make your interactions with large language models resilient to provider outages, you can define a **fallback** models to use. This will allow the plan to automatically fallback to another model if the previous step in the execution plan fails.

Use this when:
- You want to make your model interactions resilient to provider outages
- You want to potentially have multiple fallback models

**Example** (Adding a Fallback to Anthropic from OpenAi)

```ts twoslash {23-27} collapse={6-14}
import type { LanguageModel } from "@effect/ai"
import { AnthropicLanguageModel } from "@effect/ai-anthropic"
import { OpenAiLanguageModel } from "@effect/ai-openai"
import { Data, Effect, ExecutionPlan, Schedule } from "effect"

class NetworkError extends Data.TaggedError("NetworkError") {}

class ProviderOutage extends Data.TaggedError("ProviderOutage") {}

declare const generateDadJoke: Effect.Effect<
  LanguageModel.GenerateTextResponse<{}>,
  NetworkError | ProviderOutage,
  LanguageModel.LanguageModel
>

const DadJokePlan = ExecutionPlan.make({
  provide: OpenAiLanguageModel.model("gpt-4o"),
  attempts: 3,
  schedule: Schedule.exponential("100 millis", 1.5),
  while: (error: NetworkError | ProviderOutage) =>
    error._tag === "NetworkError"
}, {
  provide: AnthropicLanguageModel.model("claude-4-sonnet-20250514"),
  attempts: 2,
  schedule: Schedule.exponential("100 millis", 1.5),
  while: (error: NetworkError | ProviderOutage) =>
    error._tag === "ProviderOutage"
})

//     ┌─── Effect<..., ..., AnthropicClient | OpenAiClient>
//     ▼
const main = Effect.gen(function*() {
  const response = yield* generateDadJoke
  console.log(response.text)
}).pipe(Effect.withExecutionPlan(DadJokePlan))
```

This plan contains two steps.

**Step 1**

The first step will:
- Provide OpenAi's `"gpt-4o"` model as a `LanguageModel` for the program
- Attempt to call OpenAi up to 3 times
- Wait with an exponential backoff between attempts (starting at `100ms`)
- Only attempt the call to OpenAi if the error is a `NetworkError`

If all of the above logic fails to run the program successfully, the plan will
try to run the program using the second step.

**Step 2**

The second step will:
- Provide Anthropic's `"claude-4-sonnet-20250514"` model as a `LanguageModel` for the program
- Attempt to call Anthropic up to 2 times
- Wait with an exponential backoff between attempts (starting at `100ms`)
- Only attempt the fallback if the error is a `ProviderOutage`
