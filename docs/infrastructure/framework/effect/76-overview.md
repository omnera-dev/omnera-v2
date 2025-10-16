## Overview

The Order module provides a way to compare values and determine their order.
It defines an interface `Order<A>` which represents a single function for comparing two values of type `A`.
The function returns `-1`, `0`, or `1`, indicating whether the first value is less than, equal to, or greater than the second value.

Here's the basic structure of an `Order`:

```ts showLineNumbers=false
interface Order<A> {
  (first: A, second: A): -1 | 0 | 1
}
```
