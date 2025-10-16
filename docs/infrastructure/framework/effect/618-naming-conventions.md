## Naming Conventions

The naming conventions in `effect/Schema` are designed to be straightforward and logical, **focusing primarily on compatibility with JSON serialization**. This approach simplifies the understanding and use of schemas, especially for developers who are integrating web technologies where JSON is a standard data interchange format.

### Overview of Naming Strategies

**JSON-Compatible Types**

Schemas that naturally serialize to JSON-compatible formats are named directly after their data types.

For instance:

- `Schema.Date`: serializes JavaScript Date objects to ISO-formatted strings, a typical method for representing dates in JSON.
- `Schema.Number`: used directly as it maps precisely to the JSON number type, requiring no special transformation to remain JSON-compatible.

**Non-JSON-Compatible Types**

When dealing with types that do not have a direct representation in JSON, the naming strategy incorporates additional details to indicate the necessary transformation. This helps in setting clear expectations about the schema's behavior:

For instance:

- `Schema.DateFromSelf`: indicates that the schema handles `Date` objects, which are not natively JSON-serializable.
- `Schema.NumberFromString`: this naming suggests that the schema processes numbers that are initially represented as strings, emphasizing the transformation from string to number when decoding.

The primary goal of these schemas is to ensure that domain objects can be easily serialized ("encoded") and deserialized ("decoded") for transmission over network connections, thus facilitating their transfer between different parts of an application or across different applications.

### Rationale

While JSON's ubiquity justifies its primary consideration in naming, the conventions also accommodate serialization for other types of transport. For instance, converting a `Date` to a string is a universally useful method for various communication protocols, not just JSON. Thus, the selected naming conventions serve as sensible defaults that prioritize clarity and ease of use, facilitating the serialization and deserialization processes across diverse technological environments.

# [Introduction to Effect Schema](https://effect.website/docs/schema/introduction/)
