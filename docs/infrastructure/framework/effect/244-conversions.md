## Conversions

| Function         | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `toDateUtc`      | Returns a JavaScript `Date` in UTC.                                     |
| `toDate`         | Applies the time zone (if present) and converts to a JavaScript `Date`. |
| `zonedOffset`    | For a `Zoned` DateTime, returns the time zone offset in ms.             |
| `zonedOffsetIso` | For a `Zoned` DateTime, returns an ISO offset string like "+01:00".     |
| `toEpochMillis`  | Returns the Unix epoch time in milliseconds.                            |
| `removeTime`     | Returns a `Utc` with the time cleared (only date remains).              |
