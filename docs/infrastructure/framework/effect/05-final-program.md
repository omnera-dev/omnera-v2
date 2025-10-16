## Final Program

Assuming you've wired everything up correctly:

```ts showLineNumbers=false
const program = Effect.gen(function* () {
  const todos = yield* getTodos
  yield* Effect.forEach(todos, (todo) => notifyOwner(todo), {
    concurrency: "unbounded"
  })
}).pipe(Effect.repeat(Schedule.fixed("10 seconds")))
```

With this program, the `getTodos` operation retrieves the todos for each user. Then, the `Effect.forEach` function is used to notify the owner of each todo concurrently, without waiting for the notifications to complete.

The `repeat` function is applied to the entire chain of operations, and it ensures that the program repeats every 10 seconds using a fixed schedule. This means that the entire process, including fetching todos and sending notifications, will be executed repeatedly with a 10-second interval.

The program incorporates a caching mechanism, which prevents the same `GetUserById` operation from being executed more than once within a span of 1 minute. This default caching behavior helps optimize the program's execution and reduces unnecessary requests to fetch user data.

Furthermore, the program is designed to send emails in batches, allowing for efficient processing and better utilization of resources.
