## Combining Two or More Eithers

### zipWith

The `Either.zipWith` function lets you combine two `Either` values using a provided function. It creates a new `Either` that holds the combined value of both original `Either` values.

**Example** (Combining Two Eithers into an Object)

```ts twoslash
import { Either } from 'effect'

const maybeName: Either.Either<string, string> = Either.right('John')
const maybeAge: Either.Either<number, string> = Either.right(25)

// Combine the name and age into a person object
const person = Either.zipWith(maybeName, maybeAge, (name, age) => ({
  name: name.toUpperCase(),
  age,
}))

console.log(person)
/*
Output:
{ _id: 'Either', _tag: 'Right', right: { name: 'JOHN', age: 25 } }
*/
```

If either of the `Either` values is `Left`, the result will be `Left`, holding the first encountered `Left` value:

**Example** (Combining Eithers with a Left Value)

```ts twoslash {4}
import { Either } from 'effect'

const maybeName: Either.Either<string, string> = Either.right('John')
const maybeAge: Either.Either<number, string> = Either.left('Oh no!')

// Since maybeAge is a Left, the result will also be Left
const person = Either.zipWith(maybeName, maybeAge, (name, age) => ({
  name: name.toUpperCase(),
  age,
}))

console.log(person)
/*
Output:
{ _id: 'Either', _tag: 'Left', left: 'Oh no!' }
*/
```

### all

To combine multiple `Either` values without transforming their contents, you can use `Either.all`. This function returns an `Either` with a structure matching the input:

- If you pass a tuple, the result will be a tuple of the same length.
- If you pass a struct, the result will be a struct with the same keys.
- If you pass an `Iterable`, the result will be an array.

**Example** (Combining Multiple Eithers into a Tuple and Struct)

```ts twoslash
import { Either } from 'effect'

const maybeName: Either.Either<string, string> = Either.right('John')
const maybeAge: Either.Either<number, string> = Either.right(25)

//      ┌─── Either<[string, number], string>
//      ▼
const tuple = Either.all([maybeName, maybeAge])
console.log(tuple)
/*
Output:
{ _id: 'Either', _tag: 'Right', right: [ 'John', 25 ] }
*/

//      ┌─── Either<{ name: string; age: number; }, string>
//      ▼
const struct = Either.all({ name: maybeName, age: maybeAge })
console.log(struct)
/*
Output:
{ _id: 'Either', _tag: 'Right', right: { name: 'John', age: 25 } }
*/
```

If one or more `Either` values are `Left`, the first `Left` encountered is returned:

**Example** (Handling Multiple Left Values)

```ts
import { Either } from 'effect'

const maybeName: Either.Either<string, string> = Either.left('name not found')
const maybeAge: Either.Either<number, string> = Either.left('age not found')

// The first Left value will be returned
console.log(Either.all([maybeName, maybeAge]))
/*
Output:
{ _id: 'Either', _tag: 'Left', left: 'name not found' }
*/
```
