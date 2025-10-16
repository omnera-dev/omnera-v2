## Overview

import { Aside, Tabs, TabItem } from "@astrojs/starlight/components"

The `Scope` data type is a core construct in Effect for managing resources in a safe and composable way.

A scope represents the lifetime of one or more resources. When the scope is closed, all the resources within it are released, ensuring that no resources are leaked. Scopes also allow the addition of **finalizers**, which define how to release resources.

With the `Scope` data type, you can:

- **Add finalizers**: A finalizer specifies the cleanup logic for a resource.
- **Close the scope**: When the scope is closed, all resources are released, and the finalizers are executed.

**Example** (Managing a Scope)

```ts twoslash
import { Scope, Effect, Console, Exit } from 'effect'

const program =
  // create a new scope
  Scope.make().pipe(
    // add finalizer 1
    Effect.tap((scope) => Scope.addFinalizer(scope, Console.log('finalizer 1'))),
    // add finalizer 2
    Effect.tap((scope) => Scope.addFinalizer(scope, Console.log('finalizer 2'))),
    // close the scope
    Effect.andThen((scope) => Scope.close(scope, Exit.succeed('scope closed successfully')))
  )

Effect.runPromise(program)
/*
Output:
finalizer 2 <-- finalizers are closed in reverse order
finalizer 1
*/
```

In the above example, finalizers are added to the scope, and when the scope is closed, the finalizers are **executed in the reverse order**.

This reverse order is important because it ensures that resources are released in the correct sequence.

For instance, if you acquire a network connection and then access a file on a remote server, the file must be closed before the network connection to avoid errors.
