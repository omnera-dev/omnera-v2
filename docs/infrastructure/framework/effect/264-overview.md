## Overview

An `Exit<A, E>` describes the result of running an `Effect` workflow.

There are two possible states for an `Exit<A, E>`:

- `Exit.Success`: Contains a success value of type `A`.
- `Exit.Failure`: Contains a failure [Cause](/docs/data-types/cause/) of type `E`.
