## Formatting

| Function           | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `format`           | Formats a `DateTime` as a string using the `DateTimeFormat` API.     |
| `formatLocal`      | Uses the system's local time zone and locale for formatting.         |
| `formatUtc`        | Forces UTC formatting.                                               |
| `formatIntl`       | Uses a provided `Intl.DateTimeFormat`.                               |
| `formatIso`        | Returns an ISO 8601 string in UTC.                                   |
| `formatIsoDate`    | Returns an ISO date string, adjusted for the time zone.              |
| `formatIsoDateUtc` | Returns an ISO date string in UTC.                                   |
| `formatIsoOffset`  | Formats a `Zoned` as a string with an offset like "+01:00".          |
| `formatIsoZoned`   | Formats a `Zoned` in the form `YYYY-MM-DDTHH:mm:ss.sss+HH:MM[Zone]`. |
