## Using runForEach

Another way to consume elements of a stream is by using `Stream.runForEach`. It takes a callback function that receives each element of the stream. Here's an example:

```ts twoslash
import { Stream, Effect, Console } from 'effect'

const effect = Stream.make(1, 2, 3).pipe(Stream.runForEach((n) => Console.log(n)))

Effect.runPromise(effect).then(console.log)
/*
Output:
1
2
3
undefined
*/
```

In this example, we use `Stream.runForEach` to log each element to the console.
