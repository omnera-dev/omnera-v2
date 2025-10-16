## Importing Micro

Before you start, make sure you have completed the following setup:

Install the `effect` library in your project. If it is not already installed, you can add it using npm with the following command:

<Tabs syncKey="package-manager">

<TabItem label="npm" icon="seti:npm">

```sh showLineNumbers=false
npm install effect
```

</TabItem>

<TabItem label="pnpm" icon="pnpm">

```sh showLineNumbers=false
pnpm add effect
```

</TabItem>

<TabItem label="Yarn" icon="seti:yarn">

```sh showLineNumbers=false
yarn add effect
```

</TabItem>

<TabItem label="Bun" icon="bun">

```sh showLineNumbers=false
bun add effect
```

</TabItem>
<TabItem label="Deno" icon="deno">

```sh showLineNumbers=false
deno add npm:effect
```

</TabItem>

</Tabs>

Micro is a part of the Effect library and can be imported just like any other module:

```ts showLineNumbers=false
import { Micro } from "effect"
```

You can also import it using a namespace import like this:

```ts showLineNumbers=false
import * as Micro from "effect/Micro"
```

Both forms of import allow you to access the functionalities provided by the `Micro` module.

However an important consideration is **tree shaking**, which refers to a process that eliminates unused code during the bundling of your application.
Named imports may generate tree shaking issues when a bundler doesn't support deep scope analysis.

Here are some bundlers that support deep scope analysis and thus don't have issues with named imports:

- Rollup
- Webpack 5+
