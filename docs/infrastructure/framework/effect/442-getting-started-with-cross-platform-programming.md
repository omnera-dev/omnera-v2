## Getting Started with Cross-Platform Programming

Here's a basic example using the `Path` module to create a file path, which can run across different environments:

**Example** (Cross-Platform Path Handling)

```ts twoslash title="index.ts"
import { Path } from "@effect/platform"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  // Access the Path service
  const path = yield* Path.Path

  // Join parts of a path to create a complete file path
  const mypath = path.join("tmp", "file.txt")

  console.log(mypath)
})
```

### Running the Program in Node.js or Deno

First, install the Node.js-specific package:

<Tabs syncKey="package-manager">

<TabItem label="npm" icon="seti:npm">

```sh showLineNumbers=false
npm install @effect/platform-node
```

</TabItem>

<TabItem label="pnpm" icon="pnpm">

```sh showLineNumbers=false
pnpm add @effect/platform-node
```

</TabItem>

<TabItem label="Yarn" icon="yarn">

```sh showLineNumbers=false
yarn add @effect/platform-node
```

</TabItem>

<TabItem label="Deno" icon="deno">

```sh showLineNumbers=false
deno add npm:@effect/platform-node
```

</TabItem>

</Tabs>

Update the program to load the Node.js-specific context:

**Example** (Providing Node.js Context)

```ts twoslash title="index.ts" ins={3,15}
import { Path } from "@effect/platform"
import { Effect } from "effect"
import { NodeContext, NodeRuntime } from "@effect/platform-node"

const program = Effect.gen(function* () {
  // Access the Path service
  const path = yield* Path.Path

  // Join parts of a path to create a complete file path
  const mypath = path.join("tmp", "file.txt")

  console.log(mypath)
})

NodeRuntime.runMain(program.pipe(Effect.provide(NodeContext.layer)))
```

Finally, run the program in Node.js using `tsx`, or directly in Deno:

<Tabs syncKey="package-manager">

<TabItem label="npm" icon="seti:npm">

```sh showLineNumbers=false
npx tsx index.ts
# Output: tmp/file.txt
```

</TabItem>

<TabItem label="pnpm" icon="pnpm">

```sh showLineNumbers=false
pnpm dlx tsx index.ts
# Output: tmp/file.txt
```

</TabItem>

<TabItem label="Yarn" icon="seti:yarn">

```sh showLineNumbers=false
yarn dlx tsx index.ts
# Output: tmp/file.txt
```

</TabItem>

<TabItem label="Deno" icon="deno">

```sh showLineNumbers=false
deno run index.ts
# Output: tmp/file.txt

# or

deno run -RE index.ts
# Output: tmp/file.txt
# (granting required Read and Environment permissions without being prompted)
```

</TabItem>

</Tabs>

### Running the Program in Bun

To run the same program in Bun, first install the Bun-specific package:

```sh showLineNumbers=false
bun add @effect/platform-bun
```

Update the program to use the Bun-specific context:

**Example** (Providing Bun Context)

```ts twoslash title="index.ts" ins={3,15}
import { Path } from "@effect/platform"
import { Effect } from "effect"
import { BunContext, BunRuntime } from "@effect/platform-bun"

const program = Effect.gen(function* () {
  // Access the Path service
  const path = yield* Path.Path

  // Join parts of a path to create a complete file path
  const mypath = path.join("tmp", "file.txt")

  console.log(mypath)
})

BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)))
```

Run the program in Bun:

```sh showLineNumbers=false
bun index.ts
tmp/file.txt
```

# [KeyValueStore](https://effect.website/docs/platform/key-value-store/)
