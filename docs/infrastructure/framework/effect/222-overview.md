## Overview

import { Aside } from "@astrojs/starlight/components"

A `Chunk<A>` represents an ordered, immutable collection of values of type `A`. While similar to an array, `Chunk` provides a functional interface, optimizing certain operations that can be costly with regular arrays, like repeated concatenation.

<Aside type="caution" title="Use Chunk Only for Repeated Concatenation">
  `Chunk` is optimized to manage the performance cost of repeated array
  concatenation. For cases that do not involve repeated concatenation,
  using `Chunk` may introduce unnecessary overhead, resulting in slower
  performance.
</Aside>
