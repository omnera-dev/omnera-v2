## The MicroExit Type

The `MicroExit` type is used to represent the result of a `Micro` computation.
It can either be successful, containing a value of type `A`, or it can fail, containing an error of type `E` wrapped in a `MicroCause`.

```ts showLineNumbers=false
type MicroExit<A, E> = MicroExit.Success<A, E> | MicroExit.Failure<A, E>
```
