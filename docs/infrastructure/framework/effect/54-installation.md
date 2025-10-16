## Installation

First, we will need to install the base `@effect/ai` package to gain access to the core AI abstractions. In addition, we will need to install at least one provider integration package (in this case `@effect/ai-openai`):

<Tabs syncKey="package-manager">

<TabItem label="npm" icon="seti:npm">

```sh showLineNumbers=false
# Install the base package for the core abstractions (always required)
npm install @effect/ai

# Install one (or more) provider integrations
npm install @effect/ai-openai

# Also add the core Effect package (if not already installed)
npm install effect
```

</TabItem>

<TabItem label="pnpm" icon="pnpm">

```sh showLineNumbers=false
# Install the base package for the core abstractions (always required)
pnpm add @effect/ai

# Install one (or more) provider integrations
pnpm add @effect/ai-openai

# Also add the core Effect package (if not already installed)
pnpm add effect
```

</TabItem>

<TabItem label="Yarn" icon="seti:yarn">

```sh showLineNumbers=false
# Install the base package for the core abstractions (always required)
yarn add @effect/ai

# Install one (or more) provider integrations
yarn add @effect/ai-openai

# Also add the core Effect package (if not already installed)
yarn add effect
```

</TabItem>

<TabItem label="Bun" icon="bun">

```sh showLineNumbers=false
# Install the base package for the core abstractions (always required)
bun add @effect/ai

# Install one (or more) provider integrations
bun add @effect/ai-openai

# Also add the core Effect package (if not already installed)
bun add effect
```

</TabItem>

</Tabs>
