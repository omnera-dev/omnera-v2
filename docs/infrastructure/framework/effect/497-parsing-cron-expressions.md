## Parsing Cron Expressions

Instead of manually constructing a `Cron`, you can use UNIX-like cron strings and parse them with `parse` or `unsafeParse`.

### parse

The `parse(cronExpression, tz?)` function safely parses a cron string into a `Cron` instance. It returns an [Either](/docs/data-types/either/), which will contain either the parsed `Cron` or a parsing error.

**Example** (Safely Parsing a Cron Expression)

```ts twoslash
import { Either, Cron } from 'effect'

// Define a cron expression for 4:00 AM
// on the 8th to the 14th of every month
const expression = '0 0 4 8-14 * *'

// Parse the cron expression
const eitherCron = Cron.parse(expression)

if (Either.isRight(eitherCron)) {
  // Successfully parsed
  console.log('Parsed cron:', eitherCron.right)
} else {
  // Parsing failed
  console.error('Failed to parse cron:', eitherCron.left.message)
}
```

### unsafeParse

The `unsafeParse(cronExpression, tz?)` function works like [parse](#parse), but instead of returning an [Either](/docs/data-types/either/), it throws an exception if the input is invalid.

**Example** (Parsing a Cron Expression)

```ts twoslash
import { Cron } from 'effect'

// Parse a cron expression for 4:00 AM
// on the 8th to the 14th of every month
// Throws if the expression is invalid
const cron = Cron.unsafeParse('0 0 4 8-14 * *')
```
