## Running the Program

Now that we have a `Layer` which provides us with an `OpenAiClient`, we're ready to make our `main` program runnable.

Our final program looks like the following:

```ts twoslash
import { OpenAiClient, OpenAiLanguageModel } from '@effect/ai-openai'
import { LanguageModel } from '@effect/ai'
import { NodeHttpClient } from '@effect/platform-node'
import { Config, Effect, Layer } from 'effect'

const generateDadJoke = Effect.gen(function* () {
  const response = yield* LanguageModel.generateText({
    prompt: 'Generate a dad joke',
  })
  console.log(response.text)
  return response
})

const Gpt4o = OpenAiLanguageModel.model('gpt-4o')

const main = generateDadJoke.pipe(Effect.provide(Gpt4o))

const OpenAi = OpenAiClient.layerConfig({
  apiKey: Config.redacted('OPENAI_API_KEY'),
})

const OpenAiWithHttp = Layer.provide(OpenAi, NodeHttpClient.layerUndici)

main.pipe(Effect.provide(OpenAiWithHttp), Effect.runPromise)
```

# [Introduction to Effect AI](https://effect.website/docs/ai/introduction/)
