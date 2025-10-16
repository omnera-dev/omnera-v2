## Pattern Matching

The `Cause.match` function provides a straightforward way to handle each case of a `Cause`. By defining callbacks for each possible cause type, you can respond to specific error scenarios with custom behavior.

**Example** (Pattern Matching on Different Causes)

```ts twoslash
import { Cause } from "effect"

const cause = Cause.parallel(
  Cause.fail(new Error("my fail message")),
  Cause.die("my die message")
)

console.log(
  Cause.match(cause, {
    onEmpty: "(empty)",
    onFail: (error) => `(error: ${error.message})`,
    onDie: (defect) => `(defect: ${defect})`,
    onInterrupt: (fiberId) => `(fiberId: ${fiberId})`,
    onSequential: (left, right) =>
      `(onSequential (left: ${left}) (right: ${right}))`,
    onParallel: (left, right) =>
      `(onParallel (left: ${left}) (right: ${right})`
  })
)
/*
Output:
(onParallel (left: (error: my fail message)) (right: (defect: my die message))
*/
```
