## Overview

# Scheduling

Scheduling is an important concept in Effect that allows you to define recurring effectful operations. It involves the use of the `Schedule` type, which is an immutable value that describes a scheduled pattern for executing effects.

The `Schedule` type is structured as follows:

```text showLineNumbers=false
          ┌─── The type of output produced by the schedule
          │   ┌─── The type of input consumed by the schedule
          │   │     ┌─── Additional requirements for the schedule
          ▼   ▼     ▼
Schedule<Out, In, Requirements>
```

A schedule operates by consuming values of type `In` (such as errors in the case of `retry`, or values in the case of `repeat`) and producing values of type `Out`. It determines when to halt or continue the execution based on input values and its internal state.

The inclusion of a `Requirements` parameter allows the schedule to leverage additional services or resources as needed.

Schedules are defined as a collection of intervals spread out over time. Each interval represents a window during which the recurrence of an effect is possible.
