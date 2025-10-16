## Mocking the File System

In testing environments, you may want to mock the file system to avoid performing actual disk operations. The `FileSystem.layerNoop` provides a no-operation implementation of the `FileSystem` service.

Most operations in `FileSystem.layerNoop` return a **failure** (e.g., `Effect.fail` for missing files) or a **defect** (e.g., `Effect.die` for unimplemented features).
However, you can override specific behaviors by passing an object to `FileSystem.layerNoop` to define custom return values for selected methods.

**Example** (Mocking File System with Custom Behavior)

```ts twoslash
import { FileSystem } from '@effect/platform'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem

  const exists = yield* fs.exists('/some/path')
  console.log(exists)

  const content = yield* fs.readFileString('/some/path')
  console.log(content)
})

//      ┌─── Layer<FileSystem.FileSystem, never, never>
//      ▼
const customMock = FileSystem.layerNoop({
  readFileString: () => Effect.succeed('mocked content'),
  exists: (path) => Effect.succeed(path === '/some/path'),
})

// Provide the customized FileSystem mock implementation
Effect.runPromise(program.pipe(Effect.provide(customMock)))
/*
Output:
true
mocked content
*/
```

# [Introduction to Effect Platform](https://effect.website/docs/platform/introduction/)
