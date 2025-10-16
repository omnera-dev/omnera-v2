## Finalization

In this section, we'll explore the concept of finalization in streams. Finalization allows us to execute a specific action before a stream ends. This can be particularly useful when we want to perform cleanup tasks or add final touches to a stream.

Imagine a scenario where our streaming application needs to clean up a temporary directory when it completes its execution. We can achieve this using the `Stream.finalizer` function:

```ts twoslash
import { Stream, Console, Effect } from 'effect'

const application = Stream.fromEffect(Console.log('Application Logic.'))

const deleteDir = (dir: string) => Console.log(`Deleting dir: ${dir}`)

const program = application.pipe(
  Stream.concat(
    Stream.finalizer(
      deleteDir('tmp').pipe(Effect.andThen(Console.log('Temporary directory was deleted.')))
    )
  )
)

Effect.runPromise(Stream.runCollect(program)).then(console.log)
/*
Output:
Application Logic.
Deleting dir: tmp
Temporary directory was deleted.
{
  _id: "Chunk",
  values: [ undefined, undefined ]
}
*/
```

In this code example, we start with our application logic represented by the `application` stream. We then use `Stream.finalizer` to define a finalization step, which deletes a temporary directory and logs a message. This ensures that the temporary directory is cleaned up properly when the application completes its execution.
