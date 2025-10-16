## Constructors

The module introduces a concept known as "Case classes", which automate various essential operations when defining data types.
These operations include generating **constructors**, handling **equality** checks, and managing **hashing**.

Case classes can be defined in two primary ways:

- as plain objects using `case` or `tagged`
- as TypeScript classes using `Class` or `TaggedClass`

### case

The `Data.case` helper generates constructors and built-in support for equality checks and hashing for your data type.

**Example** (Defining a Case Class and Checking Equality)

In this example, `Data.case` is used to create a constructor for `Person`. The resulting instances have built-in support for equality checks, allowing you to compare them directly using `Equal.equals`.

```ts twoslash
import { Data, Equal } from 'effect'

interface Person {
  readonly name: string
}

// Create a constructor for `Person`
//
//      ┌─── (args: { readonly name: string; }) => Person
//      ▼
const make = Data.case<Person>()

const alice = make({ name: 'Alice' })

console.log(Equal.equals(alice, make({ name: 'Alice' })))
// Output: true

console.log(Equal.equals(alice, make({ name: 'John' })))
// Output: false
```

**Example** (Defining and Comparing Nested Case Classes)

This example demonstrates using `Data.case` to create nested data structures, such as a `Person` type containing an `Address`. Both `Person` and `Address` constructors support equality checks.

```ts twoslash
import { Data, Equal } from 'effect'

interface Address {
  readonly street: string
  readonly city: string
}

// Create a constructor for `Address`
const Address = Data.case<Address>()

interface Person {
  readonly name: string
  readonly address: Address
}

// Create a constructor for `Person`
const Person = Data.case<Person>()

const alice = Person({
  name: 'Alice',
  address: Address({ street: '123 Main St', city: 'Wonderland' }),
})

const anotherAlice = Person({
  name: 'Alice',
  address: Address({ street: '123 Main St', city: 'Wonderland' }),
})

console.log(Equal.equals(alice, anotherAlice))
// Output: true
```

Alternatively, you can use `Data.struct` to create nested data structures without defining a separate `Address` constructor.

**Example** (Using `Data.struct` for Nested Objects)

```ts twoslash
import { Data, Equal } from 'effect'

interface Person {
  readonly name: string
  readonly address: {
    readonly street: string
    readonly city: string
  }
}

// Create a constructor for `Person`
const Person = Data.case<Person>()

const alice = Person({
  name: 'Alice',
  address: Data.struct({ street: '123 Main St', city: 'Wonderland' }),
})

const anotherAlice = Person({
  name: 'Alice',
  address: Data.struct({ street: '123 Main St', city: 'Wonderland' }),
})

console.log(Equal.equals(alice, anotherAlice))
// Output: true
```

**Example** (Defining and Comparing Recursive Case Classes)

This example demonstrates a recursive structure using `Data.case` to define a binary tree where each node can contain other nodes.

```ts twoslash
import { Data, Equal } from 'effect'

interface BinaryTree<T> {
  readonly value: T
  readonly left: BinaryTree<T> | null
  readonly right: BinaryTree<T> | null
}

// Create a constructor for `BinaryTree`
const BinaryTree = Data.case<BinaryTree<number>>()

const tree1 = BinaryTree({
  value: 0,
  left: BinaryTree({ value: 1, left: null, right: null }),
  right: null,
})

const tree2 = BinaryTree({
  value: 0,
  left: BinaryTree({ value: 1, left: null, right: null }),
  right: null,
})

console.log(Equal.equals(tree1, tree2))
// Output: true
```

### tagged

When you're working with a data type that includes a tag field, like in disjoint union types, defining the tag manually for each instance can get repetitive. Using the `case` approach requires you to specify the tag field every time, which can be cumbersome.

**Example** (Defining a Tagged Case Class Manually)

Here, we create a `Person` type with a `_tag` field using `Data.case`. Notice that the `_tag` needs to be specified for every new instance.

```ts twoslash
import { Data } from 'effect'

interface Person {
  readonly _tag: 'Person' // the tag
  readonly name: string
}

const Person = Data.case<Person>()

// Repeating `_tag: 'Person'` for each instance
const alice = Person({ _tag: 'Person', name: 'Alice' })
const bob = Person({ _tag: 'Person', name: 'Bob' })
```

To streamline this process, the `Data.tagged` helper automatically adds the tag. It follows the convention in the Effect ecosystem of naming the tag field as `"_tag"`.

**Example** (Using Data.tagged to Simplify Tagging)

The `Data.tagged` helper allows you to define the tag just once, making instance creation simpler.

```ts twoslash
import { Data } from 'effect'

interface Person {
  readonly _tag: 'Person' // the tag
  readonly name: string
}

const Person = Data.tagged<Person>('Person')

// The `_tag` field is automatically added
const alice = Person({ name: 'Alice' })
const bob = Person({ name: 'Bob' })

console.log(alice)
// Output: { name: 'Alice', _tag: 'Person' }
```

### Class

If you prefer working with classes instead of plain objects, you can use `Data.Class` as an alternative to `Data.case`. This approach may feel more natural in scenarios where you want a class-oriented structure, complete with methods and custom logic.

**Example** (Using Data.Class for a Class-Oriented Structure)

Here's how to define a `Person` class using `Data.Class`:

```ts twoslash
import { Data, Equal } from 'effect'

// Define a Person class extending Data.Class
class Person extends Data.Class<{ name: string }> {}

// Create an instance of Person
const alice = new Person({ name: 'Alice' })

// Check for equality between two instances
console.log(Equal.equals(alice, new Person({ name: 'Alice' })))
// Output: true
```

One of the benefits of using classes is that you can easily add custom methods and getters. This allows you to extend the functionality of your data types.

**Example** (Adding Custom Getters to a Class)

In this example, we add a `upperName` getter to the `Person` class to return the name in uppercase:

```ts twoslash
import { Data } from 'effect'

// Extend Person class with a custom getter
class Person extends Data.Class<{ name: string }> {
  get upperName() {
    return this.name.toUpperCase()
  }
}

// Create an instance and use the custom getter
const alice = new Person({ name: 'Alice' })

console.log(alice.upperName)
// Output: ALICE
```

### TaggedClass

If you prefer a class-based approach but also want the benefits of tagging for disjoint unions, `Data.TaggedClass` can be a helpful option. It works similarly to `tagged` but is tailored for class definitions.

**Example** (Defining a Tagged Class with Built-In Tagging)

Here's how to define a `Person` class using `Data.TaggedClass`. Notice that the tag `"Person"` is automatically added:

```ts twoslash
import { Data, Equal } from 'effect'

// Define a tagged class Person with the _tag "Person"
class Person extends Data.TaggedClass('Person')<{ name: string }> {}

// Create an instance of Person
const alice = new Person({ name: 'Alice' })

console.log(alice)
// Output: Person { name: 'Alice', _tag: 'Person' }

// Check equality between two instances
console.log(Equal.equals(alice, new Person({ name: 'Alice' })))
// Output: true
```

One benefit of using tagged classes is the ability to easily add custom methods and getters, extending the class's functionality as needed.

**Example** (Adding Custom Getters to a Tagged Class)

In this example, we add a `upperName` getter to the `Person` class, which returns the name in uppercase:

```ts twoslash
import { Data } from 'effect'

// Extend the Person class with a custom getter
class Person extends Data.TaggedClass('Person')<{ name: string }> {
  get upperName() {
    return this.name.toUpperCase()
  }
}

// Create an instance and use the custom getter
const alice = new Person({ name: 'Alice' })

console.log(alice.upperName)
// Output: ALICE
```
