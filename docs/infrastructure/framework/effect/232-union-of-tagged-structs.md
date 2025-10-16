## Union of Tagged Structs

To create a disjoint union of tagged structs, you can use `Data.TaggedEnum` and `Data.taggedEnum`. These utilities make it straightforward to define and work with unions of plain objects.

### Definition

The type passed to `Data.TaggedEnum` must be an object where the keys represent the tags,
and the values define the structure of the corresponding data types.

**Example** (Defining a Tagged Union and Checking Equality)

```ts twoslash
import { Data, Equal } from "effect"

// Define a union type using TaggedEnum
type RemoteData = Data.TaggedEnum<{
  Loading: {}
  Success: { readonly data: string }
  Failure: { readonly reason: string }
}>

// Create constructors for each case in the union
const { Loading, Success, Failure } = Data.taggedEnum<RemoteData>()

// Instantiate different states
const state1 = Loading()
const state2 = Success({ data: "test" })
const state3 = Success({ data: "test" })
const state4 = Failure({ reason: "not found" })

// Check equality between states
console.log(Equal.equals(state2, state3)) // Output: true
console.log(Equal.equals(state2, state4)) // Output: false

// Display the states
console.log(state1) // Output: { _tag: 'Loading' }
console.log(state2) // Output: { data: 'test', _tag: 'Success' }
console.log(state4) // Output: { reason: 'not found', _tag: 'Failure' }
```

<Aside type="note" title="Tag Field Naming Convention">
  The tag field `"_tag"` is used to identify the type of each state,
  following Effect's naming convention.
</Aside>

### $is and $match

The `Data.taggedEnum` provides `$is` and `$match` functions for convenient type guarding and pattern matching.

**Example** (Using Type Guards and Pattern Matching)

```ts twoslash
import { Data } from "effect"

type RemoteData = Data.TaggedEnum<{
  Loading: {}
  Success: { readonly data: string }
  Failure: { readonly reason: string }
}>

const { $is, $match, Loading, Success } = Data.taggedEnum<RemoteData>()

// Use `$is` to create a type guard for "Loading"
const isLoading = $is("Loading")

console.log(isLoading(Loading()))
// Output: true
console.log(isLoading(Success({ data: "test" })))
// Output: false

// Use `$match` for pattern matching
const matcher = $match({
  Loading: () => "this is a Loading",
  Success: ({ data }) => `this is a Success: ${data}`,
  Failure: ({ reason }) => `this is a Failure: ${reason}`
})

console.log(matcher(Success({ data: "test" })))
// Output: "this is a Success: test"
```

### Adding Generics

You can create more flexible and reusable tagged unions by using `TaggedEnum.WithGenerics`. This approach allows you to define tagged unions that can handle different types dynamically.

**Example** (Using Generics with TaggedEnum)

```ts twoslash
import { Data } from "effect"

// Define a generic TaggedEnum for RemoteData
type RemoteData<Success, Failure> = Data.TaggedEnum<{
  Loading: {}
  Success: { data: Success }
  Failure: { reason: Failure }
}>

// Extend TaggedEnum.WithGenerics to add generics
interface RemoteDataDefinition extends Data.TaggedEnum.WithGenerics<2> {
  readonly taggedEnum: RemoteData<this["A"], this["B"]>
}

// Create constructors for the generic RemoteData
const { Loading, Failure, Success } =
  Data.taggedEnum<RemoteDataDefinition>()

// Instantiate each case with specific types
const loading = Loading()
const failure = Failure({ reason: "not found" })
const success = Success({ data: 1 })
```
