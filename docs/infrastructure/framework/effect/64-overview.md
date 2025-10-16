## Overview

Imagine that we've refactored our `generateDadJoke` program from our [Getting Started](/docs/ai/getting-started/) guide. Now, instead of handling all errors internally, the code can **fail with domain-specific issues** like network interruptions or provider outages:

```ts twoslash
import type { LanguageModel } from '@effect/ai'
import { OpenAiLanguageModel } from '@effect/ai-openai'
import { Data, Effect } from 'effect'

class NetworkError extends Data.TaggedError('NetworkError') {}

class ProviderOutage extends Data.TaggedError('ProviderOutage') {}

declare const generateDadJoke: Effect.Effect<
  LanguageModel.GenerateTextResponse<{}>,
  NetworkError | ProviderOutage,
  LanguageModel.LanguageModel
>

const main = Effect.gen(function* () {
  const response = yield* generateDadJoke
  console.log(response.text)
}).pipe(Effect.provide(OpenAiLanguageModel.model('gpt-4o')))
```

This is fine, but what if we want to:

- Retry the program a fixed number of times on `NetworkError`s
- Add some backoff delay between retries
- Fallback to a different model provider if OpenAi is down

How can we accomplish such logic?
