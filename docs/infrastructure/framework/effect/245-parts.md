## Parts

| Function                   | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| `toParts`                  | Returns time zone adjusted date parts (including weekday).             |
| `toPartsUtc`               | Returns UTC date parts (including weekday).                            |
| `getPart` / `getPartUtc`   | Retrieves a specific part (e.g., `"year"` or `"month"`) from the date. |
| `setParts` / `setPartsUtc` | Updates certain parts of a date, preserving or ignoring the time zone. |

**Example** (Extracting Parts from a DateTime)

```ts twoslash
import { DateTime } from 'effect'

const zoned = DateTime.setZone(
  DateTime.unsafeMake('2024-01-01'),
  DateTime.zoneUnsafeMakeNamed('Europe/Rome')
)

console.log(DateTime.getPart(zoned, 'month'))
// Output: 1
```
