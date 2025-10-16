## Avoid Tacit Usage

Avoid using tacit (point-free) function calls, such as `Effect.map(fn)`, or using `flow` from the `effect/Function` module.

In Effect, it's generally safer to write functions explicitly:

```ts showLineNumbers=false
Effect.map((x) => fn(x))
```

rather than in a point-free style:

```ts showLineNumbers=false
Effect.map(fn)
```

While tacit functions may be appealing for their brevity, they can introduce a number of problems:

- Using tacit functions, particularly when dealing with optional parameters, can be unsafe. For example, if a function has overloads, writing it in a tacit style may erase all generics, resulting in bugs. Check out this X thread for more details: [link to thread](https://twitter.com/MichaelArnaldi/status/1670715270845935616).

- Tacit usage can also compromise TypeScript's ability to infer types, potentially causing unexpected errors. This isn't just a matter of style but a way to avoid subtle mistakes that can arise from type inference issues.

- Additionally, stack traces might not be as clear when tacit usage is employed.

Avoiding tacit usage is a simple precaution that makes your code more reliable.

# [Pattern Matching](https://effect.website/docs/code-style/pattern-matching/)
