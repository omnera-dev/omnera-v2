## How to Perform Equality Checking in Effect

In Effect it's advisable to **stop using** JavaScript's `===` and `==` operators and instead rely on the `Equal.equals` function.
This function can work with any data type that implements the `Equal` interface.
Some examples of such data types include [Option](/docs/data-types/option/), [Either](/docs/data-types/either/), [HashSet](https://effect-ts.github.io/effect/effect/HashSet.ts.html), and [HashMap](https://effect-ts.github.io/effect/effect/HashMap.ts.html).

When you use `Equal.equals` and your objects do not implement the `Equal` interface, it defaults to using the `===` operator for object comparison:

**Example** (Using `Equal.equals` with Default Comparison)

```ts twoslash
import { Equal } from "effect"

// Two objects with identical properties and values
const a = { name: "Alice", age: 30 }
const b = { name: "Alice", age: 30 }

// Equal.equals falls back to the default '===' comparison
console.log(Equal.equals(a, b))
// Output: false
```

In this example, `a` and `b` are two separate objects with the same contents. However, `===` considers them different because they occupy different memory locations. This behavior can lead to unexpected results when you want to compare values based on their content.

However, you can configure your models to ensure that `Equal.equals` behaves consistently with your custom equality checks. There are two alternative approaches:

1. **Implementing the `Equal` Interface**: This method is useful when you need to define your custom equality check.

2. **Using the Data Module**: For simple value equality, the [Data](/docs/data-types/data/) module provides a more straightforward solution by automatically generating default implementations for `Equal`.

Let's explore both.

### Implementing the Equal Interface

To create custom equality behavior, you can implement the `Equal` interface in your models. This interface extends the `Hash` interface from the [Hash](/docs/trait/hash/) module.

**Example** (Implementing `Equal` and `Hash` for a Custom Class)

```ts twoslash
import { Equal, Hash } from "effect"

class Person implements Equal.Equal {
  constructor(
    readonly id: number, // Unique identifier
    readonly name: string,
    readonly age: number
  ) {}

  // Define equality based on id, name, and age
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

  // Generate a hash code based on the unique id
  [Hash.symbol](): number {
    return Hash.hash(this.id)
  }
}
```

In the above code, we define a custom equality function `[Equal.symbol]` and a hash function `[Hash.symbol]` for the `Person` class. The `Hash` interface optimizes equality checks by comparing hash values instead of the objects themselves. When you use the `Equal.equals` function to compare two objects, it first checks if their hash values are equal. If not, it quickly determines that the objects are not equal, avoiding the need for a detailed property-by-property comparison.

Once you've implemented the `Equal` interface, you can utilize the `Equal.equals` function to check for equality using your custom logic.

**Example** (Comparing `Person` Instances)

```ts twoslash collapse={3-26}
import { Equal, Hash } from "effect"

class Person implements Equal.Equal {
  constructor(
    readonly id: number, // Unique identifier for each person
    readonly name: string,
    readonly age: number
  ) {}

  // Defines equality based on id, name, and age
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

  // Generates a hash code based primarily on the unique id
  [Hash.symbol](): number {
    return Hash.hash(this.id)
  }
}

const alice = new Person(1, "Alice", 30)
console.log(Equal.equals(alice, new Person(1, "Alice", 30)))
// Output: true

const bob = new Person(2, "Bob", 40)
console.log(Equal.equals(alice, bob))
// Output: false
```

In this code, the equality check returns `true` when comparing `alice` to a new `Person` object with identical property values and `false` when comparing `alice` to `bob` due to their differing property values.

### Simplifying Equality with the Data Module

Implementing both `Equal` and `Hash` can become cumbersome when all you need is straightforward value equality checks. Luckily, the [Data](/docs/data-types/data/) module provides a simpler solution. It offers APIs that automatically generate default implementations for both `Equal` and `Hash`.

**Example** (Using `Data.struct` for Equality Checks)

```ts twoslash
import { Equal, Data } from "effect"

const alice = Data.struct({ id: 1, name: "Alice", age: 30 })

const bob = Data.struct({ id: 2, name: "Bob", age: 40 })

console.log(
  Equal.equals(alice, Data.struct({ id: 1, name: "Alice", age: 30 }))
)
// Output: true

console.log(Equal.equals(alice, { id: 1, name: "Alice", age: 30 }))
// Output: false

console.log(Equal.equals(alice, bob))
// Output: false
```

In this example, we use the [Data.struct](/docs/data-types/data/#struct) function to create structured data objects and check their equality using `Equal.equals`. The Data module simplifies the process by providing a default implementation for both `Equal` and `Hash`, allowing you to focus on comparing values without the need for explicit implementations.

The Data module isn't limited to just structs. It can handle various data types, including tuples, arrays, and records. If you're curious about how to leverage its full range of features, you can explore the [Data module documentation](/docs/data-types/data/#value-equality).
