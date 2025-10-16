## Mapping

### Mapping over the Right Value

Use `Either.map` to transform the `Right` value of an `Either`. The function you provide will only apply to the `Right` value, leaving any `Left` value unchanged.

**Example** (Transforming the Right Value)

```ts twoslash
import { Either } from "effect"

// Transform the Right value by adding 1
const rightResult = Either.map(Either.right(1), (n) => n + 1)
console.log(rightResult)
/*
Output:
{ _id: 'Either', _tag: 'Right', right: 2 }
*/

// The transformation is ignored for Left values
const leftResult = Either.map(Either.left("not a number"), (n) => n + 1)
console.log(leftResult)
/*
Output:
{ _id: 'Either', _tag: 'Left', left: 'not a number' }
*/
```

### Mapping over the Left Value

Use `Either.mapLeft` to transform the `Left` value of an `Either`. The provided function only applies to the `Left` value, leaving any `Right` value unchanged.

**Example** (Transforming the Left Value)

```ts twoslash
import { Either } from "effect"

// The transformation is ignored for Right values
const rightResult = Either.mapLeft(Either.right(1), (s) => s + "!")
console.log(rightResult)
/*
Output:
{ _id: 'Either', _tag: 'Right', right: 1 }
*/

// Transform the Left value by appending "!"
const leftResult = Either.mapLeft(
  Either.left("not a number"),
  (s) => s + "!"
)
console.log(leftResult)
/*
Output:
{ _id: 'Either', _tag: 'Left', left: 'not a number!' }
*/
```

### Mapping over Both Values

Use `Either.mapBoth` to transform both the `Left` and `Right` values of an `Either`. This function takes two separate transformation functions: one for the `Left` value and another for the `Right` value.

**Example** (Transforming Both Left and Right Values)

```ts twoslash
import { Either } from "effect"

const transformedRight = Either.mapBoth(Either.right(1), {
  onLeft: (s) => s + "!",
  onRight: (n) => n + 1
})
console.log(transformedRight)
/*
Output:
{ _id: 'Either', _tag: 'Right', right: 2 }
*/

const transformedLeft = Either.mapBoth(Either.left("not a number"), {
  onLeft: (s) => s + "!",
  onRight: (n) => n + 1
})
console.log(transformedLeft)
/*
Output:
{ _id: 'Either', _tag: 'Left', left: 'not a number!' }
*/
```
