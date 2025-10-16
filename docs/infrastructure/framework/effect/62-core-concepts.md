## Core Concepts

Effect’s AI integrations are built around the idea of **provider-agnostic programming**. Instead of hardcoding calls to a specific LLM provider's API, you describe your interaction using the services provided by the base `@effect/ai` package.

These services expose capabilities such as:

- **Generating Text** – single-shot text generation
- **Generating Embeddings** – vector representations of text for search or retrieval
- **Tool Calling** – structured outputs and tool usage
- **Streaming** – incremental output for memory efficiency and responsiveness

Each of these services is defined as an _Effect service_ — meaning they can be injected, composed, and tested just like any other dependency in the Effect ecosystem.

This decoupling lets you write your AI code as a pure description of what you want to happen, and resolve _how_ it happens later — whether by wiring up OpenAI, Anthropic, a mock service for tests, or even your own custom LLM backend.

---
