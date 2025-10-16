## Recovering from Failure

When working with streams that may encounter errors, it's crucial to know how to handle these errors gracefully. The `Stream.orElse` function is a powerful tool for recovering from failures and switching to an alternative stream in case of an error.

**Example**

```ts twoslash
import { Stream, Effect } from "effect"

const s1 = Stream.make(1, 2, 3).pipe(
  Stream.concat(Stream.fail("Oh! Error!")),
  Stream.concat(Stream.make(4, 5))
)

const s2 = Stream.make("a", "b", "c")

const stream = Stream.orElse(s1, () => s2)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: "Chunk",
  values: [ 1, 2, 3, "a", "b", "c" ]
}
*/
```

In this example, `s1` encounters an error, but instead of terminating the stream, we gracefully switch to `s2` using `Stream.orElse`. This ensures that we can continue processing data even if one stream fails.

There's also a variant called `Stream.orElseEither` that uses the [Either](/docs/data-types/either/) data type to distinguish elements from the two streams based on success or failure:

```ts twoslash
import { Stream, Effect } from "effect"

const s1 = Stream.make(1, 2, 3).pipe(
  Stream.concat(Stream.fail("Oh! Error!")),
  Stream.concat(Stream.make(4, 5))
)

const s2 = Stream.make("a", "b", "c")

const stream = Stream.orElseEither(s1, () => s2)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: "Chunk",
  values: [
    {
      _id: "Either",
      _tag: "Left",
      left: 1
    }, {
      _id: "Either",
      _tag: "Left",
      left: 2
    }, {
      _id: "Either",
      _tag: "Left",
      left: 3
    }, {
      _id: "Either",
      _tag: "Right",
      right: "a"
    }, {
      _id: "Either",
      _tag: "Right",
      right: "b"
    }, {
      _id: "Either",
      _tag: "Right",
      right: "c"
    }
  ]
}
*/
```

The `Stream.catchAll` function provides advanced error handling capabilities compared to `Stream.orElse`. With `Stream.catchAll`, you can make decisions based on both the type and value of the encountered failure.

```ts twoslash
import { Stream, Effect } from "effect"

const s1 = Stream.make(1, 2, 3).pipe(
  Stream.concat(Stream.fail("Uh Oh!" as const)),
  Stream.concat(Stream.make(4, 5)),
  Stream.concat(Stream.fail("Ouch" as const))
)

const s2 = Stream.make("a", "b", "c")

const s3 = Stream.make(true, false, false)

const stream = Stream.catchAll(
  s1,
  (error): Stream.Stream<string | boolean> => {
    switch (error) {
      case "Uh Oh!":
        return s2
      case "Ouch":
        return s3
    }
  }
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: "Chunk",
  values: [ 1, 2, 3, "a", "b", "c" ]
}
*/
```

In this example, we have a stream, `s1`, which may encounter two different types of errors. Instead of a straightforward switch to an alternative stream, as done with `Stream.orElse`, we employ `Stream.catchAll` to precisely determine how to handle each type of error. This level of control over error recovery enables you to choose different streams or actions based on the specific error conditions.
