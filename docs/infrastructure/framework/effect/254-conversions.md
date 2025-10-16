## Conversions

Converts a `Duration` to a human readable string.

**Example**

```ts twoslash
import { Duration } from 'effect'

Duration.format(Duration.millis(1000)) // "1s"
Duration.format(Duration.millis(1001)) // "1s 1ms"
```

# [Either](https://effect.website/docs/data-types/either/)
