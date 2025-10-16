## Overview

import { Aside } from "@astrojs/starlight/components"

Layer memoization allows a layer to be created once and used multiple times in the dependency graph. If we use the same layer twice:

```ts showLineNumbers=false "L1"
Layer.merge(Layer.provide(L2, L1), Layer.provide(L3, L1))
```

then the `L1` layer will be allocated only once.

<Aside type="caution" title="Avoid Duplicate Layer Creation">
  Layers are memoized using **reference equality**. Therefore, if you have
  a layer that is created by calling a function like `f()`, you should
  _only_ call that `f` once and re-use the resulting layer so that you are
  always using the same instance.
</Aside>
