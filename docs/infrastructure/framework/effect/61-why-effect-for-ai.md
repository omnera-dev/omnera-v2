## Why Effect for AI?

Integrating LLMs isn’t just about sending API requests — it’s handling streaming output, retries, rate limits, timeouts, and user-driven side effects, all while keeping your system stable and responsive. Effect provides simple, composable building blocks to model these workflows in a **safe**, **declarative**, and **composable** manner.

By using Effect for your LLM interactions you'll benefit from:

- 🧩 **Provider-Agnostic Architecture**
  Write your business logic once, and defer choosing the underlying provider (OpenAI, Anthropic, local models, mocks, etc.) until runtime

- 🧪 **Fully Testable**
  Because LLM interactions are modeled via Effect services, you can mock, simulate, or snapshot responses just by providing an alternative implementation

- 🧵 **Structured Concurrency**
  Run concurrent LLM calls, cancel stale requests, stream partial results, or race multiple providers — all safely managed by Effect’s structured concurrency model

- 🔍 **Observability**
  Leverage Effect's built-in tracing, logging, and metrics to instrument your LLM interactions to gain deep insight into performance bottlenecks or failures in production

...and much more!
