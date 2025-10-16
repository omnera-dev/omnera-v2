## How Branded Types Help

Branded types allow you to create distinct types from the same underlying type by adding a unique type tag, enforcing proper usage at compile-time.

Branding is accomplished by adding a symbolic identifier that distinguishes one type from another at the type level.
This method ensures that types remain distinct without altering their runtime characteristics.

Let's start by introducing the `BrandTypeId` symbol:

```ts twoslash
const BrandTypeId: unique symbol = Symbol.for("effect/Brand")

type ProductId = number & {
  readonly [BrandTypeId]: {
    readonly ProductId: "ProductId" // unique identifier for ProductId
  }
}
```

This approach assigns a unique identifier as a brand to the `number` type, effectively differentiating `ProductId` from other numerical types.
The use of a symbol ensures that the branding field does not conflict with any existing properties of the `number` type.

Attempting to use a `UserId` in place of a `ProductId` now results in an error:

**Example** (Enforcing Type Safety with Branded Types)

```ts twoslash
const BrandTypeId: unique symbol = Symbol.for("effect/Brand")

type ProductId = number & {
  readonly [BrandTypeId]: {
    readonly ProductId: "ProductId"
  }
}

const getProductById = (id: ProductId) => {
  // Logic to retrieve product
}

type UserId = number

const id: UserId = 1

// @errors: 2345
getProductById(id)
```

The error message clearly states that a `number` cannot be used in place of a `ProductId`.

TypeScript won't let us pass an instance of `number` to the function accepting `ProductId` because it's missing the brand field.

Let's add branding to `UserId` as well:

**Example** (Branding UserId and ProductId)

```ts twoslash
const BrandTypeId: unique symbol = Symbol.for("effect/Brand")

type ProductId = number & {
  readonly [BrandTypeId]: {
    readonly ProductId: "ProductId" // unique identifier for ProductId
  }
}

const getProductById = (id: ProductId) => {
  // Logic to retrieve product
}

type UserId = number & {
  readonly [BrandTypeId]: {
    readonly UserId: "UserId" // unique identifier for UserId
  }
}

declare const id: UserId

// @errors: 2345
getProductById(id)
```

The error indicates that while both types use branding, the unique values associated with the branding fields (`"ProductId"` and `"UserId"`) ensure they remain distinct and non-interchangeable.
