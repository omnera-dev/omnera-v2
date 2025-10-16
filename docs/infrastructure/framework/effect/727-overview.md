## Overview

In the Stream module, you'll find that most of the constructors offer a special variant designed for lifting a scoped resource into a `Stream`. When you use these specific constructors, you're essentially creating streams that are inherently safe with regards to resource management. These constructors, before creating the stream, handle the resource acquisition, and after the stream's usage, they ensure its proper closure.

Stream also provides us with `Stream.acquireRelease` and `Stream.finalizer` constructors that share similarities with `Effect.acquireRelease` and `Effect.addFinalizer`. These tools empower us to perform cleanup or finalization tasks before the stream concludes its operation.
