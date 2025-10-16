## Overview

import { Aside } from "@astrojs/starlight/components"

Pattern matching is a method that allows developers to handle intricate conditions within a single, concise expression. It simplifies code, making it more concise and easier to understand. Additionally, it includes a process called exhaustiveness checking, which helps to ensure that no possible case has been overlooked.

Originating from functional programming languages, pattern matching stands as a powerful technique for code branching. It often offers a more potent and less verbose solution compared to imperative alternatives such as if/else or switch statements, particularly when dealing with complex conditions.

Although not yet a native feature in JavaScript, there's an ongoing [tc39 proposal](https://github.com/tc39/proposal-pattern-matching) in its early stages to introduce pattern matching to JavaScript. However, this proposal is at stage 1 and might take several years to be implemented. Nonetheless, developers can implement pattern matching in their codebase. The `effect/Match` module provides a reliable, type-safe pattern matching implementation that is available for immediate use.

**Example** (Handling Different Data Types with Pattern Matching)

```ts twoslash
import { Match } from "effect"

// Simulated dynamic input that can be a string or a number
const input: string | number = "some input"

//      ┌─── string
//      ▼
const result = Match.value(input).pipe(
  // Match if the value is a number
  Match.when(Match.number, (n) => `number: ${n}`),
  // Match if the value is a string
  Match.when(Match.string, (s) => `string: ${s}`),
  // Ensure all possible cases are covered
  Match.exhaustive
)

console.log(result)
// Output: "string: some input"
```
