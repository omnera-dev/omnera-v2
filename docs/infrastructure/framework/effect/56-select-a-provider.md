## Select a Provider

Next, we need to select which model provider we want to use:

**Example** (Using a Model Provider to Satisfy the `LanguageModel` Requirement)

```ts twoslash collapse={5-11}
import { OpenAiLanguageModel } from '@effect/ai-openai'
import { LanguageModel } from '@effect/ai'
import { Effect } from 'effect'

const generateDadJoke = Effect.gen(function* () {
  const response = yield* LanguageModel.generateText({
    prompt: 'Generate a dad joke',
  })
  console.log(response.text)
  return response
})

// Create a `Model` which provides a concrete implementation of
// `LanguageModel` and requires an `OpenAiClient`
//
//      ┌─── Model<"openai", LanguageModel | ProviderName, OpenAiClient>
//      ▼
const Gpt4o = OpenAiLanguageModel.model('gpt-4o')

// Provide the `Model` to the program
//
//     ┌─── Effect<GenerateTextResponse<{}>, AiError, OpenAiClient>
//     ▼
const main = generateDadJoke.pipe(Effect.provide(Gpt4o))
```

Before moving on, it is important that we understand the purpose of the `Model` data type.
