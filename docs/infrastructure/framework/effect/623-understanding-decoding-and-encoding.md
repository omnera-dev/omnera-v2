## Understanding Decoding and Encoding

When working with data in TypeScript, you often need to handle data coming from or being sent to external systems. This data may not always match the format or types you expect, especially when dealing with user input, data from APIs, or data stored in different formats. To handle these discrepancies, we use **decoding** and **encoding**.

| Term         | Description                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **Decoding** | Used for parsing data from external sources where you have no control over the data format.                  |
| **Encoding** | Used when sending data out to external sources, converting it to a format that is expected by those sources. |

For instance, when working with forms in the frontend, you often receive untyped data in the form of strings. This data can be tampered with and does not natively support arrays or booleans. Decoding helps you validate and parse this data into more useful types like numbers, dates, and arrays. Encoding allows you to convert these types back into the string format expected by forms.

Below is a diagram that shows the relationship between encoding and decoding using a `Schema<A, I, R>`:

```text showLineNumbers=false
┌─────────┐       ┌───┐       ┌───┐       ┌─────────┐
| unknown |       | A |       | I |       | unknown |
└─────────┘       └───┘       └───┘       └─────────┘
     |              |           |              |
     | validate     |           |              |
     |─────────────►│           |              |
     |              |           |              |
     | is           |           |              |
     |─────────────►│           |              |
     |              |           |              |
     | asserts      |           |              |
     |─────────────►│           |              |
     |              |           |              |
     | encodeUnknown|           |              |
     |─────────────────────────►|              |
                    |           |              |
                    | encode    |              |
                    |──────────►│              |
                    |           |              |
                    |    decode |              |
                    | ◄─────────|              |
                    |           |              |
                    |           | decodeUnknown|
                    | ◄────────────────────────|
```

We'll break down these concepts using an example with a `Schema<Date, string, never>`. This schema serves as a tool to transform a `string` into a `Date` and vice versa.

### Encoding

When we talk about "encoding," we are referring to the process of changing a `Date` into a `string`. To put it simply, it's the act of converting data from one format to another.

### Decoding

Conversely, "decoding" entails transforming a `string` back into a `Date`. It's essentially the reverse operation of encoding, where data is returned to its original form.

### Decoding From Unknown

Decoding from `unknown` involves two key steps:

1. **Checking:** Initially, we verify that the input data (which is of the `unknown` type) matches the expected structure. In our specific case, this means ensuring that the input is indeed a `string`.

2. **Decoding:** Following the successful check, we proceed to convert the `string` into a `Date`. This process completes the decoding operation, where the data is both validated and transformed.

### Encoding From Unknown

Encoding from `unknown` involves two key steps:

1. **Checking:** Initially, we verify that the input data (which is of the `unknown` type) matches the expected structure. In our specific case, this means ensuring that the input is indeed a `Date`.

2. **Encoding:** Following the successful check, we proceed to convert the `Date` into a `string`. This process completes the encoding operation, where the data is both validated and transformed.
