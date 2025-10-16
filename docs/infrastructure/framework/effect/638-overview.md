## Overview

import { Aside } from "@astrojs/starlight/components"

The `Schema.standardSchemaV1` API allows you to generate a [Standard Schema v1](https://standardschema.dev/) object from an Effect `Schema`.

**Example** (Generating a Standard Schema V1)

```ts twoslash
import { Schema } from "effect"

const schema = Schema.Struct({
  name: Schema.String
})

// Convert an Effect schema into a Standard Schema V1 object
//
//      ┌─── StandardSchemaV1<{ readonly name: string; }>
//      ▼
const standardSchema = Schema.standardSchemaV1(schema)
```

<Aside type="note" title="Schema Restrictions">
  Only schemas that do not have dependencies (i.e., `R = never`) can be
  converted to a Standard Schema V1 object.
</Aside>
