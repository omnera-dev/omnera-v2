## Overview

A `Deferred<Success, Error>` is a specialized subtype of `Effect` that acts like a one-time variable with some unique characteristics. It can only be completed once, making it a useful tool for managing asynchronous operations and synchronization between different parts of your program.

A deferred is essentially a synchronization primitive that represents a value that may not be available right away. When you create a deferred, it starts out empty. Later, it can be completed with either a success value `Success` or an error value `Error`:

```text showLineNumbers=false
           ┌─── Represents the success type
           │        ┌─── Represents the error type
           │        │
           ▼        ▼
Deferred<Success, Error>
```

Once completed, it cannot be changed again.

When a fiber calls `Deferred.await`, it will pause until the deferred is completed. While the fiber is waiting, it doesn't block the thread, it only blocks semantically. This means other fibers can still run, ensuring efficient concurrency.

A deferred is conceptually similar to JavaScript's `Promise`.
The key difference is that it supports both success and error types, giving more type safety.
