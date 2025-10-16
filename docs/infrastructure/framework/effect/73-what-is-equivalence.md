## What is Equivalence?

An `Equivalence<A>` represents a function that compares two values of type `A` and determines if they are equivalent. This is more flexible and customizable than simple equality checks using `===`.

Here's the structure of an `Equivalence`:

```ts showLineNumbers=false
interface Equivalence<A> {
  (self: A, that: A): boolean
}
```
