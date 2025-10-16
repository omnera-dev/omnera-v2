## Overview

Just like any other program, Effect programs may fail for expected or unexpected reasons.
The difference between a non-Effect program and an Effect program is in the detail provided to you when your program fails.
Effect attempts to preserve as much information as possible about what caused your program to fail to produce a detailed,
comprehensive, and human readable failure message.

In an Effect program, there are two possible ways for a program to fail:

- **Expected Errors**: These are errors that developers anticipate and expect as part of normal program execution.

- **Unexpected Errors**: These are errors that occur unexpectedly and are not part of the intended program flow.
