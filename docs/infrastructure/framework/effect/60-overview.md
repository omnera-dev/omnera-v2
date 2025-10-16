## Overview

import { Aside } from "@astrojs/starlight/components"

<Aside type="caution" title="Experimental Module">
  The Effect AI integration packages are currently in the experimental / alpha stage. We encourage your feedback to further improve their features.
</Aside>

Welcome to the documentation for Effect's AI integration packages — a set of libraries designed to make working with large language models (LLMs) seamless, flexible, and provider-agnostic.

These packages enable you to write programs that describe _what_ you want to do with an LLM — generating completions, handling chat interactions, running function calls — without having to commit to _how_ or _where_ those operations are executed.

The core package, [`@effect/ai`](https://www.npmjs.com/package/@effect/ai), provides a high-level, unified interface for modeling LLM interactions, independent of any specific provider. Once you're ready to run your program, you can plug in the services your program requires from our LLM provider integration packages.

This separation of concerns allows you to:

- Write clean, declarative business logic without worrying about provider-specific quirks
- Easily swap between or combine providers at runtime or during testing
- Take advantage of Effect’s features when building AI-driven workflows

Whether you're building an intelligent agent, an interactive chat app, or a system that leverages LLMs for background tasks, Effect's AI packages offer the flexibility and control you need!

Let’s dive in!
