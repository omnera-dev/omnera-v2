## value

The `Redacted.value` function retrieves the original value from a `Redacted` instance. Use this function carefully, as it exposes the sensitive data, potentially making it visible in logs or accessible in unintended ways.

**Example** (Accessing the Underlying Sensitive Value)

```ts twoslash
import { Redacted } from "effect"

const API_KEY = Redacted.make("1234567890")

// Expose the redacted value
console.log(Redacted.value(API_KEY))
// Output: "1234567890"
```
