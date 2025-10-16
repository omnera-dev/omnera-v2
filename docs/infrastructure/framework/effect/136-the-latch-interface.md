## The Latch Interface

A `Latch` includes several operations that let you control and observe its state:

| Operation  | Description                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| `whenOpen` | Runs a given effect only if the latch is open, otherwise, waits until it opens.                          |
| `open`     | Opens the latch so that any waiting fibers can proceed.                                                  |
| `close`    | Closes the latch, causing fibers to wait when they reach this latch in the future.                       |
| `await`    | Suspends the current fiber until the latch is opened. If the latch is already open, returns immediately. |
| `release`  | Allows waiting fibers to continue without permanently opening the latch.                                 |
