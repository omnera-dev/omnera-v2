## Guards

To determine the specific type of a `Cause`, use the guards provided in the Cause module:

- `Cause.isEmpty`: Checks if the cause is empty, indicating no error.
- `Cause.isFailType`: Identifies causes that represent an expected failure.
- `Cause.isDie`: Identifies causes that represent an unexpected defect.
- `Cause.isInterruptType`: Identifies causes related to fiber interruptions.
- `Cause.isSequentialType`: Checks if the cause consists of sequential errors.
- `Cause.isParallelType`: Checks if the cause contains parallel errors.

**Example** (Using Guards to Identify Cause Types)

```ts twoslash
import { Cause } from "effect"

const cause = Cause.fail(new Error("my message"))

if (Cause.isFailType(cause)) {
  console.log(cause.error.message) // Output: my message
}
```

These guards allow you to accurately identify the type of a `Cause`, making it easier to handle various error cases in your code. Whether dealing with expected failures, unexpected defects, interruptions, or composite errors, these guards provide a clear method for assessing and managing error scenarios.
