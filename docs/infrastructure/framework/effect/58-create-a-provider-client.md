## Create a Provider Client

To make our code executable, we must finish satisfying our program's requirements.

Let's take another look at our program from earlier:

```ts twoslash "OpenAiClient" collapse={5-11}
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

const Gpt4o = OpenAiLanguageModel.model('gpt-4o')

//     ┌─── Effect<GenerateTextResponse<{}>, AiError, OpenAiClient>
//     ▼
const main = generateDadJoke.pipe(Effect.provide(Gpt4o))
```

We can see that our `main` program still requires us to provide an `OpenAiClient`.

Each of our provider integration packages exports a client module that can be used to construct a client for that provider.

**Example** (Creating a Client Layer for a Model Provider)

```ts twoslash /{ (OpenAiClient),/ {24-26} collapse={5-17}
import { OpenAiClient, OpenAiLanguageModel } from '@effect/ai-openai'
import { LanguageModel } from '@effect/ai'
import { Config, Effect } from 'effect'

const generateDadJoke = Effect.gen(function* () {
  const response = yield* LanguageModel.generateText({
    prompt: 'Generate a dad joke',
  })
  console.log(response.text)
  return response
})

const Gpt4o = OpenAiLanguageModel.model('gpt-4o')

const main = generateDadJoke.pipe(Effect.provide(Gpt4o))

// Create a `Layer` which produces an `OpenAiClient` and requires
// an `HttpClient`
//
//      ┌─── Layer<OpenAiClient, ConfigError, HttpClient>
//      ▼
const OpenAi = OpenAiClient.layerConfig({
  apiKey: Config.redacted('OPENAI_API_KEY'),
})
```

In the code above, we use the `layerConfig` constructor from the `OpenAiClient` module to create a `Layer` which will produce an `OpenAiClient`. The `layerConfig` constructor allows us to read in configuration variables using Effect's [configuration system](/docs/configuration/).

The provider clients also have a dependency on an `HttpClient` implementation to avoid any platform dependencies. This way, you can provide whichever `HttpClient` implementation is most appropriate for the platform your code is running upon.

For example, if we know we are going to run this code in NodeJS, we can utilize the `NodeHttpClient` module from `@effect/platform-node` to provide an `HttpClient` implementation:

```ts twoslash /{ (NodeHttpClient) }|, (HttpClient)>|, (never)>/ {35} collapse={6-18}
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

// Create a `Layer` which produces an `OpenAiClient` and requires
// an `HttpClient`
//
//      ┌─── Layer<OpenAiClient, ConfigError, HttpClient>
//      ▼
const OpenAi = OpenAiClient.layerConfig({
  apiKey: Config.redacted('OPENAI_API_KEY'),
})

// Provide a platform-specific implementation of `HttpClient` to our
// OpenAi layer
//
//        ┌─── Layer<OpenAiClient, ConfigError, never>
//        ▼
const OpenAiWithHttp = Layer.provide(OpenAi, NodeHttpClient.layerUndici)
```
