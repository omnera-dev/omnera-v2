## Overview

import { Aside } from "@astrojs/starlight/components"

When working with schemas, you have a choice beyond the [Schema.Struct](/docs/schema/basic-usage/#structs) constructor.
You can leverage the power of classes through the `Schema.Class` utility, which comes with its own set of advantages tailored to common use cases:

Classes offer several features that simplify the schema creation process:

- **All-in-One Definition**: With classes, you can define both a schema and an opaque type simultaneously.
- **Shared Functionality**: You can incorporate shared functionality using class methods or getters.
- **Value Hashing and Equality**: Utilize the built-in capability for checking value equality and applying hashing (thanks to `Class` implementing [Data.Class](/docs/data-types/data/#class)).

<Aside type="caution" title="Class Schemas Are Transformations">
  Classes defined with `Schema.Class` act as
  [transformations](/docs/schema/transformations/). See [Class Schemas are
  Transformations](#class-schemas-are-transformations) for details.
</Aside>
