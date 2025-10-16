## Latch vs Semaphore

A latch is good when you have a one-time event or condition that determines whether fibers can proceed. For example, you might use a latch to block all fibers until a setup step is finished, and then open the latch so everyone can continue.

A [semaphore](/docs/concurrency/semaphore/) with one lock (often called a binary semaphore or a mutex) is usually for mutual exclusion: it ensures that only one fiber at a time accesses a shared resource or section of code. Once a fiber acquires the lock, no other fiber can enter the protected area until the lock is released.

In short:

- Use a **latch** if you're gating a set of fibers on a specific event ("Wait here until this becomes true").
- Use a **semaphore (with one lock)** if you need to ensure only one fiber at a time is in a critical section or using a shared resource.

# [PubSub](https://effect.website/docs/concurrency/pubsub/)
