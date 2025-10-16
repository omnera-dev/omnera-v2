## unsafeWipe

The `Redacted.unsafeWipe` function erases the underlying value of a `Redacted` instance, making it inaccessible. This helps ensure that sensitive data does not remain in memory longer than needed.

**Example** (Wiping Sensitive Data from Memory)

```ts twoslash
import { Redacted } from "effect"

const API_KEY = Redacted.make("1234567890")

console.log(Redacted.value(API_KEY))
// Output: "1234567890"

Redacted.unsafeWipe(API_KEY)

console.log(Redacted.value(API_KEY))
/*
throws:
Error: Unable to get redacted value
*/
```
