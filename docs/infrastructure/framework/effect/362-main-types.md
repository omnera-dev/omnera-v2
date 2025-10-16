## Main Types

### Micro

The `Micro` type uses three type parameters:

```text showLineNumbers=false
        ┌─── Represents the success type
        │        ┌─── Represents the error type
        │        │      ┌─── Represents required dependencies
        ▼        ▼      ▼
Micro<Success, Error, Requirements>
```

which mirror those of the `Effect` type.

### MicroExit

The `MicroExit` type is a streamlined version of the [Exit](/docs/data-types/exit/) type, designed to capture the outcome of a `Micro` computation.
It can either be successful, containing a value of type `A`, or it can fail, containing an error of type `E` wrapped in a `MicroCause`.

```ts showLineNumbers=false
type MicroExit<A, E> = MicroExit.Success<A, E> | MicroExit.Failure<A, E>
```

### MicroCause

The `MicroCause` type is a streamlined version of the [Cause](/docs/data-types/cause/) type.

Similar to how `Cause` is a union of types, `MicroCause` comes in three forms:

```ts showLineNumbers=false
type MicroCause<E> = Die | Fail<E> | Interrupt
```

| Variant     | Description                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| `Die`       | Indicates an unforeseen defect that wasn't planned for in the system's logic.               |
| `Fail<E>`   | Covers anticipated errors that are recognized and typically handled within the application. |
| `Interrupt` | Signifies an operation that has been purposefully stopped.                                  |

### MicroSchedule

The `MicroSchedule` type is a streamlined version of the [Schedule](/docs/scheduling/introduction/) type.

```ts showLineNumbers=false
type MicroSchedule = (attempt: number, elapsed: number) => Option<number>
```

Represents a function that can be used to calculate the delay between
repeats.

The function takes the current attempt number and the elapsed time since
the first attempt, and returns the delay for the next attempt. If the
function returns `None`, the repetition will stop.
