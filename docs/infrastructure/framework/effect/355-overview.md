## Overview

Programming is challenging. When we build libraries and apps, we look to many tools to handle the complexity and make our day-to-day more manageable. Effect presents a new way of thinking about programming in TypeScript.

Effect is an ecosystem of tools that help you build better applications and libraries. As a result, you will also learn more about the TypeScript language and how to use the type system to make your programs more reliable and easier to maintain.

In "typical" TypeScript, without Effect, we write code that assumes that a function is either successful or throws an exception. For example:

```ts twoslash
const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}
```

Based on the types, we have no idea that this function can throw an exception. We can only find out by reading the code. This may not seem like much of a problem when you only have one function in your codebase, but when you have hundreds or thousands, it really starts to add up. It's easy to forget that a function can throw an exception, and it's easy to forget to handle that exception.

Often, we will do the "easiest" thing and just wrap the function in a `try/catch` block. This is a good first step to prevent your program from crashing, but it doesn't make it any easier to manage or understand our complex application/library. We can do better.

One of the most important tools we have in TypeScript is the compiler. It is the first line of defense against bugs, domain errors, and general complexity.
