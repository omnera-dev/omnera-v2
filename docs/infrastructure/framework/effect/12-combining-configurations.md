## Combining Configurations

Effect provides several built-in combinators that allow you to define and manipulate configurations.
These combinators take a `Config` as input and produce another `Config`, enabling more complex configuration structures.

| Combinator | Description                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `array`    | Constructs a configuration for an array of values.                                                                  |
| `chunk`    | Constructs a configuration for a sequence of values.                                                                |
| `option`   | Returns an optional configuration. If the data is missing, the result will be `None`; otherwise, it will be `Some`. |
| `repeat`   | Describes a sequence of values, each following the structure of the given config.                                   |
| `hashSet`  | Constructs a configuration for a set of values.                                                                     |
| `hashMap`  | Constructs a configuration for a key-value map.                                                                     |

Additionally, there are three special combinators for specific use cases:

| Combinator | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `succeed`  | Constructs a config that contains a predefined value.                    |
| `fail`     | Constructs a config that fails with the specified error message.         |
| `all`      | Combines multiple configurations into a tuple, struct, or argument list. |

**Example** (Using the `array` combinator)

The following example demonstrates how to load an environment variable as an array of strings using the `Config.array` constructor.

```ts twoslash title="index.ts"
import { Config, Effect } from "effect"

const program = Effect.gen(function* () {
  const config = yield* Config.array(Config.string(), "MYARRAY")
  console.log(config)
})

Effect.runPromise(program)
// Run:
// MYARRAY=a,b,c,a npx tsx index.ts
// Output:
// [ 'a', 'b', 'c', 'a' ]
```

**Example** (Using the `hashSet` combinator)

```ts twoslash title="index.ts"
import { Config, Effect } from "effect"

const program = Effect.gen(function* () {
  const config = yield* Config.hashSet(Config.string(), "MYSET")
  console.log(config)
})

Effect.runPromise(program)
// Run:
// MYSET=a,"b c",d,a npx tsx index.ts
// Output:
// { _id: 'HashSet', values: [ 'd', 'a', 'b c' ] }
```

**Example** (Using the `hashMap` combinator)

```ts twoslash title="index.ts"
import { Config, Effect } from "effect"

const program = Effect.gen(function* () {
  const config = yield* Config.hashMap(Config.string(), "MYMAP")
  console.log(config)
})

Effect.runPromise(program)
// Run:
// MYMAP_A=a MYMAP_B=b npx tsx index.ts
// Output:
// { _id: 'HashMap', values: [ [ 'A', 'a' ], [ 'B', 'b' ] ] }
```
