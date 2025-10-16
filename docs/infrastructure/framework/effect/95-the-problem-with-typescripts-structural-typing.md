## The Problem with TypeScript's Structural Typing

TypeScript's type system is structurally typed, meaning that two types are considered compatible if their members are compatible.
This can lead to situations where values of the same underlying type are used interchangeably, even when they represent different concepts or have different meanings.

Consider the following types:

```ts twoslash
type UserId = number

type ProductId = number
```

Here, `UserId` and `ProductId` are structurally identical as they are both based on `number`.
TypeScript will treat these as interchangeable, potentially causing bugs if they are mixed up in your application.

**Example** (Unintended Type Compatibility)

```ts twoslash
type UserId = number

type ProductId = number

const getUserById = (id: UserId) => {
  // Logic to retrieve user
}

const getProductById = (id: ProductId) => {
  // Logic to retrieve product
}

const id: UserId = 1

getProductById(id) // No type error, but incorrect usage
```

In the example above, passing a `UserId` to `getProductById` does not produce a type error, even though it's logically incorrect. This happens because both types are considered interchangeable.
