## Guards

| Function           | Description                                    |
| ------------------ | ---------------------------------------------- |
| `isDateTime`       | Checks if a value is a `DateTime`.             |
| `isTimeZone`       | Checks if a value is a `TimeZone`.             |
| `isTimeZoneOffset` | Checks if a value is a `TimeZone.Offset`.      |
| `isTimeZoneNamed`  | Checks if a value is a `TimeZone.Named`.       |
| `isUtc`            | Checks if a `DateTime` is the `Utc` variant.   |
| `isZoned`          | Checks if a `DateTime` is the `Zoned` variant. |

**Example** (Validating a DateTime)

```ts twoslash
import { DateTime } from 'effect'

function printDateTimeInfo(x: unknown) {
  if (DateTime.isDateTime(x)) {
    console.log('This is a valid DateTime')
  } else {
    console.log('Not a DateTime')
  }
}
```
