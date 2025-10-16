## What Are Virtual Threads?

JavaScript is inherently single-threaded, meaning it executes code in a single sequence of instructions. However, modern JavaScript environments use an event loop to manage asynchronous operations, creating the illusion of multitasking. In this context, virtual threads, or fibers, are logical threads simulated by the Effect runtime. They allow concurrent execution without relying on true multi-threading, which is not natively supported in JavaScript.
