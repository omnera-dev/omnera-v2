## Equality and uniqueness

Both `HashSet` and `MutableHashSet` use Effect's [`Equal`](/docs/trait/equal/) trait to determine if two elements are the same. This ensures that each value appears only once in the set.

- **Primitive values** (like numbers or strings) are compared by value, similar to the `===` operator.
- **Objects and custom types** must implement the `Equal` interface to define what it means for two instances to be equal. If no implementation is provided, equality falls back to reference comparison.

**Example** (Using custom equality and hashing)

```ts twoslash
import { Equal, Hash, HashSet } from "effect"

// Define a custom class that implements the Equal interface
class Person implements Equal.Equal {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly age: number
  ) {}

  // Two Person instances are equal if their id, name, and age match
  [Equal.symbol](that: Equal.Equal): boolean {
    if (that instanceof Person) {
      return (
        Equal.equals(this.id, that.id) &&
        Equal.equals(this.name, that.name) &&
        Equal.equals(this.age, that.age)
      )
    }
    return false
  }

  // Hash code is based on the id (must match the equality logic)
  [Hash.symbol](): number {
    return Hash.hash(this.id)
  }
}

// Add two different instances with the same content
const set = HashSet.empty().pipe(
  HashSet.add(new Person(1, "Alice", 30)),
  HashSet.add(new Person(1, "Alice", 30))
)

// Only one instance is kept
console.log(HashSet.size(set))
// Output: 1
```

### Simplifying Equality with Data and Schema

Effect's [`Data`](/docs/data-types/data/) and [`Schema.Data`](/docs/schema/effect-data-types/#interop-with-data) modules implement `Equal` for you automatically, based on structural equality.

**Example** (Using `Data.struct`)

```ts twoslash
import { Data, Equal, HashSet, pipe } from "effect"

// Define two records with the same content
const person1 = Data.struct({ id: 1, name: "Alice", age: 30 })
const person2 = Data.struct({ id: 1, name: "Alice", age: 30 })

// They are different object references
console.log(Object.is(person1, person2))
// Output: false

// But they are equal in value (based on content)
console.log(Equal.equals(person1, person2))
// Output: true

// Add both to a HashSet — only one will be stored
const set = pipe(
  HashSet.empty(),
  HashSet.add(person1),
  HashSet.add(person2)
)

console.log(HashSet.size(set))
// Output: 1
```

**Example** (Using `Schema.Data`)

```ts twoslash
import { Equal, MutableHashSet, Schema } from "effect"

// Define a schema that describes the structure of a Person
const PersonSchema = Schema.Data(
  Schema.Struct({
    id: Schema.Number,
    name: Schema.String,
    age: Schema.Number
  })
)

// Decode values from plain objects
const Person = Schema.decodeSync(PersonSchema)

const person1 = Person({ id: 1, name: "Alice", age: 30 })
const person2 = Person({ id: 1, name: "Alice", age: 30 })

// person1 and person2 are different instances but equal in value
console.log(Equal.equals(person1, person2))
// Output: true

// Add both to a MutableHashSet — only one will be stored
const set = MutableHashSet.empty().pipe(
  MutableHashSet.add(person1),
  MutableHashSet.add(person2)
)

console.log(MutableHashSet.size(set))
// Output: 1
```
