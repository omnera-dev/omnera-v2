## Overview

import { Aside } from "@astrojs/starlight/components"

Welcome to the documentation for `effect/Schema`, a module for defining and using schemas to validate and transform data in TypeScript.

The `effect/Schema` module allows you to define a `Schema<Type, Encoded, Requirements>` that provides a blueprint for describing the structure and data types of your data. Once defined, you can leverage this schema to perform a range of operations, including:

| Operation       | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| Decoding        | Transforming data from an input type `Encoded` to an output type `Type`.             |
| Encoding        | Converting data from an output type `Type` back to an input type `Encoded`.          |
| Asserting       | Verifying that a value adheres to the schema's output type `Type`.                   |
| Standard Schema | Generate a [Standard Schema V1](https://standardschema.dev/).                        |
| Arbitraries     | Generate arbitraries for [fast-check](https://github.com/dubzzz/fast-check) testing. |
| JSON Schemas    | Create JSON Schemas based on defined schemas.                                        |
| Equivalence     | Create [Equivalence](/docs/schema/equivalence/) based on defined schemas.            |
| Pretty printing | Support pretty printing for data structures.                                         |
