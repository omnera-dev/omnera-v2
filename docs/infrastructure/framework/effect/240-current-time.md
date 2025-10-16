## Current Time

### now

Provides the current UTC time as a `Effect<Utc>`, using the [Clock](/docs/requirements-management/default-services/) service.

**Example** (Retrieving the Current UTC Time)

```ts twoslash
import { DateTime, Effect } from 'effect'

const program = Effect.gen(function* () {
  //      ┌─── Utc
  //      ▼
  const currentTime = yield* DateTime.now
})
```

<Aside type="tip" title="Why Use the Clock Service?">
  Using the `Clock` service ensures that time is consistent across your
  application, which is particularly useful in testing environments where
  you may need to control or mock the current time.
</Aside>

### unsafeNow

Retrieves the current UTC time immediately using `Date.now()`, without the [Clock](/docs/requirements-management/default-services/) service.

**Example** (Getting the Current UTC Time Immediately)

```ts twoslash
import { DateTime } from 'effect'

//      ┌─── Utc
//      ▼
const currentTime = DateTime.unsafeNow()
```
