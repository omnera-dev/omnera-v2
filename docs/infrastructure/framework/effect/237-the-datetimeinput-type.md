## The DateTime.Input Type

The `DateTime.Input` type is a flexible input type that can be used to create a `DateTime` instance. It can be one of the following:

- A `DateTime` instance
- A JavaScript `Date` object
- A numeric value representing milliseconds since the Unix epoch
- An object with partial date [parts](#the-datetimeparts-type) (e.g., `{ year: 2024, month: 1, day: 1 }`)
- A string that can be parsed by JavaScript's [Date.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

```ts showLineNumbers=false
namespace DateTime {
  type Input = DateTime | Partial<Parts> | Date | number | string
}
```
