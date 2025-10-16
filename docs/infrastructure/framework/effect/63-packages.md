## Packages

Effect’s AI ecosystem is composed of several focused packages:

### `@effect/ai`

Defines the core abstractions for interacting with LLM provider services. This package defines the generic services and helper utilities needed to build AI-powered applications in a provider-agnostic way.

Use this package to:

- Define your application's interaction with an LLM
- Structure chat or completion flows using Effect
- Build type-safe, declarative AI logic

For detailed API documentation, see the [API Reference](https://effect-ts.github.io/effect/docs/ai/ai).

### `@effect/ai-openai`

Concrete implementations of services from `@effect/ai` backed by the [OpenAI API](https://platform.openai.com).

Supported services include:

- `LanguageModel` (via OpenAI's [Chat Completions API](https://platform.openai.com/docs/api-reference/chat))
- `EmbeddingsModel` (via OpenAI's [Embeddings API](https://platform.openai.com/docs/api-reference/embeddings))

For detailed API documentation, see the [API Reference](https://effect-ts.github.io/effect/docs/ai/openai).

### `@effect/ai-anthropic`

Concrete implementations of services from `@effect/ai` backed by the [Anthropic API](https://docs.anthropic.com/en/api/getting-started).

Supported services include:

- `LanguageModel` (via Anthropic's [Messages API](https://docs.anthropic.com/en/api/messages))

For detailed API documentation, see the [API Reference](https://effect-ts.github.io/effect/docs/ai/anthropic).

### `@effect/ai-amazon-bedrock`

Concrete implementations of services from `@effect/ai` backed by [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html).

Supported services include:

- `LanguageModel` (via Amazon Bedrock's [Converse API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)

For detailed API documentation, see the [API Reference](https://effect-ts.github.io/effect/docs/ai/amazon-bedrock).

### `@effect/ai-google`

Concrete implementations of services from `@effect/ai` backed by [Google Generative AI](https://ai.google.dev/gemini-api/docs).

Supported services include:

- `LanguageModel` (via Google's [Gemini API](https://ai.google.dev/api)

For detailed API documentation, see the [API Reference](https://effect-ts.github.io/effect/docs/ai/google).

# [Execution Planning](https://effect.website/docs/ai/planning-llm-interactions/)
