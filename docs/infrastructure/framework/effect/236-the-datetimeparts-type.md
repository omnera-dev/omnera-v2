## The DateTime.Parts Type

The `DateTime.Parts` type defines the main components of a date, such as the year, month, day, hours, minutes, and seconds.

```ts showLineNumbers=false
namespace DateTime {
  interface Parts {
    readonly millis: number
    readonly seconds: number
    readonly minutes: number
    readonly hours: number
    readonly day: number
    readonly month: number
    readonly year: number
  }

  interface PartsWithWeekday extends Parts {
    readonly weekDay: number
  }
}
```
