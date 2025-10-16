## Getting the Duration Value

You can retrieve the value of a duration in milliseconds using `Duration.toMillis`.

**Example** (Getting Duration in Milliseconds)

```ts twoslash
import { Duration } from 'effect'

console.log(Duration.toMillis(Duration.seconds(30)))
// Output: 30000
```

To get the value of a duration in nanoseconds, use `Duration.toNanos`. Note that `toNanos` returns an `Option<bigint>` because the duration might be infinite.

**Example** (Getting Duration in Nanoseconds)

```ts twoslash
import { Duration } from 'effect'

console.log(Duration.toNanos(Duration.millis(100)))
/*
Output:
{ _id: 'Option', _tag: 'Some', value: 100000000n }
*/
```

To get a `bigint` value without `Option`, use `Duration.unsafeToNanos`. However, it will throw an error for infinite durations.

**Example** (Retrieving Nanoseconds Unsafely)

```ts twoslash
import { Duration } from 'effect'

console.log(Duration.unsafeToNanos(Duration.millis(100)))
// Output: 100000000n

console.log(Duration.unsafeToNanos(Duration.infinity))
/*
throws:
Error: Cannot convert infinite duration to nanos
  ...stack trace...
*/
```
