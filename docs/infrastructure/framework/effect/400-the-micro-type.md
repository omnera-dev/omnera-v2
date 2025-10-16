## The Micro Type

Here is the general form of a `Micro`:

```text showLineNumbers=false
        ┌─── Represents the success type
        │        ┌─── Represents the error type
        │        │      ┌─── Represents required dependencies
        ▼        ▼      ▼
Micro<Success, Error, Requirements>
```

which mirror those of the `Effect` type:

| Parameter        | Description                                                                                                                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Success**      | Represents the type of value that an effect can succeed with when executed. If this type parameter is `void`, it means the effect produces no useful information, while if it is `never`, it means the effect runs forever (or until failure). |
| **Error**        | Represents the expected errors that can occur when executing an effect. If this type parameter is `never`, it means the effect cannot fail, because there are no values of type `never`.                                                       |
| **Requirements** | Represents the contextual data required by the effect to be executed. This data is stored in a collection named `Context`. If this type parameter is `never`, it means the effect has no requirements and the `Context` collection is empty.   |
