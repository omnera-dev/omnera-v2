## Overview

The `Runtime<R>` data type represents a runtime system that can **execute effects**. To run an effect, `Effect<A, E, R>`, we need a `Runtime<R>` that contains the required resources, denoted by the `R` type parameter.

A `Runtime<R>` consists of three main components:

- A value of type `Context<R>`
- A value of type `FiberRefs`
- A value of type `RuntimeFlags`
