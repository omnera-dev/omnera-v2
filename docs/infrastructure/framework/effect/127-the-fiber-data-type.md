## The Fiber Data Type

The `Fiber` data type in Effect represents a "handle" on the execution of an effect.

Here is the general form of a `Fiber`:

```text showLineNumbers=false
        ┌─── Represents the success type
        │        ┌─── Represents the error type
        │        │
        ▼        ▼
Fiber<Success, Error>
```

This type indicates that a fiber:

- Succeeds and returns a value of type `Success`
- Fails with an error of type `Error`

Fibers do not have an `Requirements` type parameter because they only execute effects that have already had their requirements provided to them.
