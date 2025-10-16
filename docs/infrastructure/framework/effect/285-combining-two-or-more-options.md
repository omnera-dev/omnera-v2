## Combining Two or More Options

### zipWith

The `Option.zipWith` function lets you combine two `Option` values using a provided function. It creates a new `Option` that holds the combined value of both original `Option` values.

**Example** (Combining Two Options into an Object)

```ts twoslash
import { Option } from "effect"

const maybeName: Option.Option<string> = Option.some("John")
const maybeAge: Option.Option<number> = Option.some(25)

// Combine the name and age into a person object
const person = Option.zipWith(maybeName, maybeAge, (name, age) => ({
  name: name.toUpperCase(),
  age
}))

console.log(person)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: { name: 'JOHN', age: 25 } }
*/
```

If either of the `Option` values is `None`, the result will be `None`:

**Example** (Handling None Values)

```ts {4} twoslash
import { Option } from "effect"

const maybeName: Option.Option<string> = Option.some("John")
const maybeAge: Option.Option<number> = Option.none()

// Since maybeAge is a None, the result will also be None
const person = Option.zipWith(maybeName, maybeAge, (name, age) => ({
  name: name.toUpperCase(),
  age
}))

console.log(person)
// Output: { _id: 'Option', _tag: 'None' }
```

### all

To combine multiple `Option` values without transforming their contents, you can use `Option.all`. This function returns an `Option` with a structure matching the input:

- If you pass a tuple, the result will be a tuple of the same length.
- If you pass a struct, the result will be a struct with the same keys.
- If you pass an `Iterable`, the result will be an array.

**Example** (Combining Multiple Options into a Tuple and Struct)

```ts twoslash
import { Option } from "effect"

const maybeName: Option.Option<string> = Option.some("John")
const maybeAge: Option.Option<number> = Option.some(25)

//      ┌─── Option<[string, number]>
//      ▼
const tuple = Option.all([maybeName, maybeAge])
console.log(tuple)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: [ 'John', 25 ] }
*/

//      ┌─── Option<{ name: string; age: number; }>
//      ▼
const struct = Option.all({ name: maybeName, age: maybeAge })
console.log(struct)
/*
Output:
{ _id: 'Option', _tag: 'Some', value: { name: 'John', age: 25 } }
*/
```

If any of the `Option` values are `None`, the result will be `None`:

**Example**

```ts
import { Option } from "effect"

const maybeName: Option.Option<string> = Option.some("John")
const maybeAge: Option.Option<number> = Option.none()

console.log(Option.all([maybeName, maybeAge]))
// Output: { _id: 'Option', _tag: 'None' }
```
