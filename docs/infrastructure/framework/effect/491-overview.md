## Overview

import { Aside } from "@astrojs/starlight/components"

To demonstrate the functionality of different schedules, we will use the following helper function
that logs each repetition along with the corresponding delay in milliseconds, formatted as:

```text showLineNumbers=false
#<repetition>: <delay in ms>
```

**Helper** (Logging Execution Delays)

```ts twoslash
import { Array, Chunk, Duration, Effect, Schedule } from 'effect'

const log = (schedule: Schedule.Schedule<unknown>, delay: Duration.DurationInput = 0): void => {
  const maxRecurs = 10 // Limit the number of executions
  const delays = Chunk.toArray(
    Effect.runSync(
      Schedule.run(
        Schedule.delays(Schedule.addDelay(schedule, () => delay)),
        Date.now(),
        Array.range(0, maxRecurs)
      )
    )
  )
  delays.forEach((duration, i) => {
    console.log(
      i === maxRecurs
        ? '...' // Indicate truncation if there are more executions
        : i === delays.length - 1
          ? '(end)' // Mark the last execution
          : `#${i + 1}: ${Duration.toMillis(duration)}ms`
    )
  })
}
```
