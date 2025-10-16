## Planning LLM Interactions

The `ExecutionPlan` module from Effect provides a robust method for creating **structured execution plans** for your Effect programs. Rather than making a single model call and hoping that it succeeds, you can use `ExecutionPlan` to describe how to handle errors, retries, and fallbacks in a clear, declarative way.

This is especially useful when:

- You want to fall back to a secondary model if the primary one is unavailable
- You want to retry on transient errors (e.g. network failures)
- You want to control timing between retry attempts
