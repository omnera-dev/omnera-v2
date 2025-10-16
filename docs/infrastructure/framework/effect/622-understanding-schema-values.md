## Understanding Schema Values

**Immutability**. `Schema` values are immutable, and every function in the `effect/Schema` module produces a new `Schema` value.

**Modeling Data Structure**. These values do not perform any actions themselves, they simply model or describe the structure of your data.

**Interpretation by Compilers**. A `Schema` can be interpreted by various "compilers" into specific operations, depending on the compiler type (decoding, encoding, pretty printing, arbitraries, etc...).
