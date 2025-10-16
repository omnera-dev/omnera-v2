## Customizing Arbitrary Data Generation

You can customize how arbitrary data is generated using the `arbitrary` annotation in schema definitions.

**Example** (Custom Arbitrary Generator)

```ts twoslash
import { Arbitrary, FastCheck, Schema } from 'effect'

const Name = Schema.NonEmptyString.annotations({
  arbitrary: () => (fc) => fc.constantFrom('Alice Johnson', 'Dante Howell', 'Marta Reyes'),
})

const Age = Schema.Int.pipe(Schema.between(1, 80))

const Person = Schema.Struct({
  name: Name,
  age: Age,
})

const arb = Arbitrary.make(Person)

console.log(FastCheck.sample(arb, 2))
/*
Example Output:
[ { name: 'Dante Howell', age: 6 }, { name: 'Marta Reyes', age: 53 } ]
*/
```

The annotation allows access the complete export of the fast-check library (`fc`).
This setup enables you to return an `Arbitrary` that precisely generates the type of data desired.

### Integration with Fake Data Generators

When using mocking libraries like [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker),
you can combine them with `fast-check` to generate realistic data for testing purposes.

**Example** (Integrating with Faker)

```ts twoslash
import { Arbitrary, FastCheck, Schema } from 'effect'
import { faker } from '@faker-js/faker'

const Name = Schema.NonEmptyString.annotations({
  arbitrary: () => (fc) =>
    fc.constant(null).map(() => {
      // Each time the arbitrary is sampled, faker generates a new name
      return faker.person.fullName()
    }),
})

const Age = Schema.Int.pipe(Schema.between(1, 80))

const Person = Schema.Struct({
  name: Name,
  age: Age,
})

const arb = Arbitrary.make(Person)

console.log(FastCheck.sample(arb, 2))
/*
Example Output:
[
  { name: 'Henry Dietrich', age: 68 },
  { name: 'Lucas Haag', age: 52 }
]
*/
```

# [Basic Usage](https://effect.website/docs/schema/basic-usage/)
