## Overview

One of the key features of the Schema design is its flexibility and ability to be customized.
This is achieved through "annotations."
Each node in the `ast` field of a schema has an `annotations: Record<string | symbol, unknown>` field,
which allows you to attach additional information to the schema.
You can manage these annotations using the `annotations` method or the `Schema.annotations` API.

**Example** (Using Annotations to Customize Schema)

```ts twoslash
import { Schema } from "effect"

// Define a Password schema, starting with a string type
const Password = Schema.String
  // Add a custom error message for non-string values
  .annotations({ message: () => "not a string" })
  .pipe(
    // Enforce non-empty strings and provide a custom error message
    Schema.nonEmptyString({ message: () => "required" }),
    // Restrict the string length to 10 characters or fewer
    // with a custom error message for exceeding length
    Schema.maxLength(10, {
      message: (issue) => `${issue.actual} is too long`
    })
  )
  .annotations({
    // Add a unique identifier for the schema
    identifier: "Password",
    // Provide a title for the schema
    title: "password",
    // Include a description explaining what this schema represents
    description:
      "A password is a secret string used to authenticate a user",
    // Add examples for better clarity
    examples: ["1Ki77y", "jelly22fi$h"],
    // Include any additional documentation
    documentation: `...technical information on Password schema...`
  })
```
