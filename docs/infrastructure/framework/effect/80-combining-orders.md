## Combining Orders

The Order module lets you combine multiple `Order` instances to create complex sorting rules. This is useful when sorting by multiple properties.

**Example** (Sorting by Multiple Criteria)

Imagine you have a list of people, each represented by an object with a `name` and an `age`. You want to sort this list first by name and then, for individuals with the same name, by age.

```ts twoslash
import { Order, Array } from 'effect'

// Define the Person interface
interface Person {
  readonly name: string
  readonly age: number
}

// Create an Order to sort people by their names in ascending order
const byName = Order.mapInput(Order.string, (person: Person) => person.name)

// Create an Order to sort people by their ages in ascending order
const byAge = Order.mapInput(Order.number, (person: Person) => person.age)

// Combine orders to sort by name, then by age
const byNameAge = Order.combine(byName, byAge)

const result = Array.sort(
  [
    { name: 'Bob', age: 20 },
    { name: 'Alice', age: 18 },
    { name: 'Bob', age: 18 },
  ],
  byNameAge
)

console.log(result)
/*
Output:
[
  { name: 'Alice', age: 18 }, // Sorted by name
  { name: 'Bob', age: 18 },   // Sorted by age within the same name
  { name: 'Bob', age: 20 }
]
*/
```
