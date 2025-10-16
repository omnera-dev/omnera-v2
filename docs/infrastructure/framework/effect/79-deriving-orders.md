## Deriving Orders

For more complex data structures, you may need custom sorting rules. The Order module lets you derive new `Order` instances from existing ones with the `Order.mapInput` function.

**Example** (Creating a Custom Order for Objects)

Imagine you have a list of `Person` objects, and you want to sort them by their names in ascending order.
To achieve this, you can create a custom `Order`.

```ts twoslash
import { Order } from 'effect'

// Define the Person interface
interface Person {
  readonly name: string
  readonly age: number
}

// Create a custom order to sort Person objects by name in ascending order
//
//      ┌─── Order<Person>
//      ▼
const byName = Order.mapInput(Order.string, (person: Person) => person.name)
```

The `Order.mapInput` function takes two arguments:

1. The existing `Order` you want to use as a base (`Order.string` in this case, for comparing strings).
2. A function that extracts the value you want to use for sorting from your data structure (`(person: Person) => person.name` in this case).

Once you have defined your custom `Order`, you can apply it to sort an array of `Person` objects:

**Example** (Sorting Objects Using a Custom Order)

```ts twoslash collapse={3-13}
import { Order, Array } from 'effect'

// Define the Person interface
interface Person {
  readonly name: string
  readonly age: number
}

// Create a custom order to sort Person objects by name in ascending order
const byName = Order.mapInput(Order.string, (person: Person) => person.name)

const persons: ReadonlyArray<Person> = [
  { name: 'Charlie', age: 22 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
]

// Sort persons array using the custom order
const sortedPersons = Array.sort(persons, byName)

console.log(sortedPersons)
/*
Output:
[
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 22 }
]
*/
```
