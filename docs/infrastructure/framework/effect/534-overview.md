## Overview

import { Aside } from "@astrojs/starlight/components"

The `Arbitrary.make` function allows for the creation of random values that align with a specific `Schema<A, I, R>`.
This function returns an `Arbitrary<A>` from the [fast-check](https://github.com/dubzzz/fast-check) library,
which is particularly useful for generating random test data that adheres to the defined schema constraints.

**Example** (Generating Arbitrary Data for a Schema)

```ts twoslash
import { Arbitrary, FastCheck, Schema } from "effect"

// Define a Person schema with constraints
const Person = Schema.Struct({
  name: Schema.NonEmptyString,
  age: Schema.Int.pipe(Schema.between(1, 80))
})

// Create an Arbitrary based on the schema
const arb = Arbitrary.make(Person)

// Generate random samples from the Arbitrary
console.log(FastCheck.sample(arb, 2))
/*
Example Output:
[ { name: 'q r', age: 3 }, { name: '&|', age: 6 } ]
*/
```

To make the output more realistic, see the [Customizing Arbitrary Data Generation](#customizing-arbitrary-data-generation) section.

<Aside type="tip" title="Access FastCheck API">
  The entirety of `fast-check`'s API is accessible via the `FastCheck`
  export, allowing direct use of all its functionalities within your
  projects.
</Aside>
