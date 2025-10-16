## The MicroCause Type

The `MicroCause` type describes the different reasons why an effect may fail.

`MicroCause` comes in three forms:

```ts showLineNumbers=false
type MicroCause<E> = Die | Fail<E> | Interrupt
```

| Variant     | Description                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| `Die`       | Indicates an unforeseen defect that wasn't planned for in the system's logic.               |
| `Fail<E>`   | Covers anticipated errors that are recognized and typically handled within the application. |
| `Interrupt` | Signifies an operation that has been purposefully stopped.                                  |
