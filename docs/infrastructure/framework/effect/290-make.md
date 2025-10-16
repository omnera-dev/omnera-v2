## make

The `Redacted.make` function creates a `Redacted<A>` instance from a given value `A`, ensuring the content is securely hidden.

**Example** (Hiding Sensitive Information from Logs)

Using `Redacted.make` helps prevent sensitive information, such as API keys, from being accidentally exposed in logs or error messages.

```ts twoslash
import { Redacted, Effect } from "effect"

// Create a redacted API key
const API_KEY = Redacted.make("1234567890")

console.log(API_KEY)
// Output: {}

console.log(String(API_KEY))
// Output: <redacted>

Effect.runSync(Effect.log(API_KEY))
// Output: timestamp=... level=INFO fiber=#0 message="\"<redacted>\""
```
