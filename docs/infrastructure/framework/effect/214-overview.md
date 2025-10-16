## Overview

The [`Effect<A, E, R>`](/docs/getting-started/the-effect-type/) type is polymorphic in error type `E`, allowing flexibility in handling any desired error type. However, there is often additional information about failures that the error type `E` alone does not capture.

To address this, Effect uses the `Cause<E>` data type to store various details such as:

- Unexpected errors or defects
- Stack and execution traces
- Reasons for fiber interruptions

Effect strictly preserves all failure-related information, storing a full picture of the error context in the `Cause` type. This comprehensive approach enables precise analysis and handling of failures, ensuring no data is lost.

Though `Cause` values aren't typically manipulated directly, they underlie errors within Effect workflows, providing access to both concurrent and sequential error details. This allows for thorough error analysis when needed.
