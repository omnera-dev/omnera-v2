## Thenable

Mapping the result of an operation:

### map

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const mapped = Promise.resolve("Hello").then((s) => s.length)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const mapped = Effect.succeed("Hello").pipe(
  Effect.map((s) => s.length)
  // or Effect.andThen((s) => s.length)
)
```

</TabItem>

</Tabs>

### flatMap

Chaining multiple operations:

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const flatMapped = Promise.resolve("Hello").then((s) =>
  Promise.resolve(s.length)
)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const flatMapped = Effect.succeed("Hello").pipe(
  Effect.flatMap((s) => Effect.succeed(s.length))
  // or Effect.andThen((s) => Effect.succeed(s.length))
)
```

</TabItem>

</Tabs>
