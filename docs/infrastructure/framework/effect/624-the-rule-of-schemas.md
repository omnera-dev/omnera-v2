## The Rule of Schemas

When working with schemas, there's an important rule to keep in mind: your schemas should be crafted in a way that when you perform both encoding and decoding operations, you should end up with the original value.

In simpler terms, if you encode a value and then immediately decode it, the result should match the original value you started with. This rule ensures that your data remains consistent and reliable throughout the encoding and decoding process.

<Aside type="tip" title="Ensure Consistency">
  As a general rule, schemas should be defined such that encode + decode
  return the original value.
</Aside>

# [Schema to JSON Schema](https://effect.website/docs/schema/json-schema/)
