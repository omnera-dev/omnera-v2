## Overview

A Latch is a synchronization tool that works like a gate, letting fibers wait until the latch is opened before they continue. The latch can be either open or closed:

- When closed, fibers that reach the latch wait until it opens.
- When open, fibers pass through immediately.

Once opened, a latch typically stays open, although you can close it again if needed

Imagine an application that processes requests only after completing an initial setup (like loading configuration data or establishing a database connection).
You can create a latch in a closed state while the setup is happening.
Any incoming requests, represented as fibers, would wait at the latch until it opens.
Once the setup is finished, you call `latch.open` so the requests can proceed.
