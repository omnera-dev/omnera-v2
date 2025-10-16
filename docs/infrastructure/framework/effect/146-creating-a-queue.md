## Creating a Queue

Queues can be **bounded** (with a specified capacity) or **unbounded** (without a limit). Different types of queues handle new values differently when they reach capacity.

### Bounded Queue

A bounded queue applies back-pressure when full, meaning any `Queue.offer` operation will suspend until there is space.

**Example** (Creating a Bounded Queue)

```ts twoslash
import { Queue } from "effect"

// Creating a bounded queue with a capacity of 100
const boundedQueue = Queue.bounded<number>(100)
```

### Dropping Queue

A dropping queue discards new values if the queue is full.

**Example** (Creating a Dropping Queue)

```ts twoslash
import { Queue } from "effect"

// Creating a dropping queue with a capacity of 100
const droppingQueue = Queue.dropping<number>(100)
```

### Sliding Queue

A sliding queue removes old values to make space for new ones when it reaches capacity.

**Example** (Creating a Sliding Queue)

```ts twoslash
import { Queue } from "effect"

// Creating a sliding queue with a capacity of 100
const slidingQueue = Queue.sliding<number>(100)
```

### Unbounded Queue

An unbounded queue has no capacity limit, allowing unrestricted additions.

**Example** (Creating an Unbounded Queue)

```ts twoslash
import { Queue } from "effect"

// Creates an unbounded queue without a capacity limit
const unboundedQueue = Queue.unbounded<number>()
```
