## Understanding Either and Exit

Either is primarily used as a **simple discriminated union** and is not recommended as the main result type for operations requiring detailed error information.

[Exit](/docs/data-types/exit/) is the preferred **result type** within Effect for capturing comprehensive details about failures.
It encapsulates the outcomes of effectful computations, distinguishing between success and various failure modes, such as errors, defects and interruptions.
