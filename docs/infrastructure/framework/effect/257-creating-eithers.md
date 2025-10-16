## Creating Eithers

You can create an `Either` using the `Either.right` and `Either.left` constructors.

Use `Either.right` to create a `Right` value of type `R`.

**Example** (Creating a Right Value)

```ts twoslash
import { Either } from 'effect'

const rightValue = Either.right(42)

console.log(rightValue)
/*
Output:
{ _id: 'Either', _tag: 'Right', right: 42 }
*/
```

Use `Either.left` to create a `Left` value of type `L`.

**Example** (Creating a Left Value)

```ts twoslash
import { Either } from 'effect'

const leftValue = Either.left('not a number')

console.log(leftValue)
/*
Output:
{ _id: 'Either', _tag: 'Left', left: 'not a number' }
*/
```
