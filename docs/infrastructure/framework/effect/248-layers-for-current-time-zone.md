## Layers for Current Time Zone

| Function                 | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `CurrentTimeZone`        | A service tag for the current time zone.                             |
| `setZoneCurrent`         | Sets a `DateTime` to use the current time zone.                      |
| `withCurrentZone`        | Provides an effect with a specified time zone.                       |
| `withCurrentZoneLocal`   | Uses the system's local time zone for the effect.                    |
| `withCurrentZoneOffset`  | Uses a fixed offset (in ms) for the effect.                          |
| `withCurrentZoneNamed`   | Uses a named time zone identifier (e.g., "Europe/London").           |
| `nowInCurrentZone`       | Retrieves the current time as a `Zoned` in the configured time zone. |
| `layerCurrentZone`       | Creates a Layer providing the `CurrentTimeZone` service.             |
| `layerCurrentZoneOffset` | Creates a Layer from a fixed offset.                                 |
| `layerCurrentZoneNamed`  | Creates a Layer from a named time zone, failing if invalid.          |
| `layerCurrentZoneLocal`  | Creates a Layer from the system's local time zone.                   |

**Example** (Using the Current Time Zone in an Effect)

```ts twoslash
import { DateTime, Effect } from "effect"

// Retrieve the current time in the "Europe/London" time zone
const program = Effect.gen(function* () {
  const zonedNow = yield* DateTime.nowInCurrentZone
  console.log(zonedNow)
}).pipe(DateTime.withCurrentZoneNamed("Europe/London"))

Effect.runFork(program)
/*
Example Output:
DateTime.Zoned(2025-01-06T18:36:38.573+00:00[Europe/London])
*/
```

# [Duration](https://effect.website/docs/data-types/duration/)
