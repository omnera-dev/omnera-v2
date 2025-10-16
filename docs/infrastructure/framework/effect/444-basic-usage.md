## Basic Usage

The module exposes a single [service](/docs/requirements-management/services/), `KeyValueStore`, which acts as the gateway for interacting with the store.

**Example** (Accessing the KeyValueStore Service)

```ts twoslash
import { KeyValueStore } from '@effect/platform'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const kv = yield* KeyValueStore.KeyValueStore

  // Use `kv` to perform operations on the store
})
```

The `KeyValueStore` interface includes the following operations:

| Operation            | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| **get**              | Returns the value as `string` of the specified key if it exists.     |
| **getUint8Array**    | Returns the value as `Uint8Array` of the specified key if it exists. |
| **set**              | Sets the value of the specified key.                                 |
| **remove**           | Removes the specified key.                                           |
| **clear**            | Removes all entries.                                                 |
| **size**             | Returns the number of entries.                                       |
| **modify**           | Updates the value of the specified key if it exists.                 |
| **modifyUint8Array** | Updates the value of the specified key if it exists.                 |
| **has**              | Check if a key exists.                                               |
| **isEmpty**          | Check if the store is empty.                                         |
| **forSchema**        | Create a `SchemaStore` for the specified schema.                     |

**Example** (Basic Operations with a Key-Value Store)

```ts twoslash
import { KeyValueStore, layerMemory } from '@effect/platform/KeyValueStore'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const kv = yield* KeyValueStore

  // Store is initially empty
  console.log(yield* kv.size)

  // Set a key-value pair
  yield* kv.set('key', 'value')
  console.log(yield* kv.size)

  // Retrieve the value
  const value = yield* kv.get('key')
  console.log(value)

  // Remove the key
  yield* kv.remove('key')
  console.log(yield* kv.size)
})

// Run the program using the in-memory store implementation
Effect.runPromise(program.pipe(Effect.provide(layerMemory)))
/*
Output:
0
1
{ _id: 'Option', _tag: 'Some', value: 'value' }
0
*/
```
