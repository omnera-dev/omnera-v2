## Define an Interaction with a Language Model

First let's define a simple interaction with a large language model (LLM):

**Example** (Using the `LanguageModel` Service to Generate a Dad Joke)

```ts twoslash
import { LanguageModel } from "@effect/ai"
import { Effect } from "effect"

// Using `LanguageModel` will add it to your program's requirements
//
//          ┌─── Effect<GenerateTextResponse<{}>, AiError, LanguageModel>
//          ▼
const generateDadJoke = Effect.gen(function*() {
  // Use the `LanguageModel` to generate some text
  const response = yield* LanguageModel.generateText({
    prompt: "Generate a dad joke"
  })
  // Log the generated text to the console
  console.log(response.text)
  // Return the response
  return response
})
```

<Aside type="note" title="Declarative LLM Interactions">
  Notice that the above code does not know or care which LLM provider (OpenAi, Anthropic, etc.) will be used. Instead, we focus on _what_ we want to accomplish (i.e. our business logic), not _how_ to accomplish it.
</Aside>
