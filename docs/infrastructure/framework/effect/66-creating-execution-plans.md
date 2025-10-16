## Creating Execution Plans

To create an `ExecutionPlan`, we can use the `ExecutionPlan.make` constructor.

**Example** (Creating an `ExecutionPlan` for LLM Interactions)

```ts twoslash collapse={5-13}
import type { LanguageModel } from '@effect/ai'
import { OpenAiLanguageModel } from '@effect/ai-openai'
import { Data, Effect, ExecutionPlan, Schedule } from 'effect'

class NetworkError extends Data.TaggedError('NetworkError') {}

class ProviderOutage extends Data.TaggedError('ProviderOutage') {}

declare const generateDadJoke: Effect.Effect<
  LanguageModel.GenerateTextResponse<{}>,
  NetworkError | ProviderOutage,
  LanguageModel.LanguageModel
>

const DadJokePlan = ExecutionPlan.make({
  provide: OpenAiLanguageModel.model('gpt-4o'),
  attempts: 3,
  schedule: Schedule.exponential('100 millis', 1.5),
  while: (error: NetworkError | ProviderOutage) => error._tag === 'NetworkError',
})

//     ┌─── Effect<void, NetworkError | ProviderOutage, OpenAiClient>
//     ▼
const main = Effect.gen(function* () {
  const response = yield* generateDadJoke
  console.log(response.text)
}).pipe(Effect.withExecutionPlan(DadJokePlan))
```

This plan contains a single step which will:

- Provide OpenAi's `"gpt-4o"` model as a `LanguageModel` for the program
- Attempt to call OpenAi up to 3 times
- Wait with an exponential backoff between attempts (starting at `100ms`)
- Only re-attempt the call to OpenAi if the error is a `NetworkError`
