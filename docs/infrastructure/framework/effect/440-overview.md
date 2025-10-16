## Overview

import {
  Aside,
  Tabs,
  TabItem,
  Badge
} from "@astrojs/starlight/components"

`@effect/platform` is a library for building platform-independent abstractions in environments such as Node.js, Deno, Bun, and browsers.

With `@effect/platform`, you can integrate abstract services like [FileSystem](/docs/platform/file-system/) or [Terminal](/docs/platform/terminal/) into your program.
When assembling your final application, you can provide specific [layers](/docs/requirements-management/layers/) for the target platform using the corresponding packages:

- `@effect/platform-node` for Node.js or Deno
- `@effect/platform-bun` for Bun
- `@effect/platform-browser` for browsers

### Stable Modules

The following modules are stable and their documentation is available on this website:

| Module                                           | Description                                                | Status                                    |
| ------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------- |
| [Command](/docs/platform/command/)               | Provides a way to interact with the command line.          | <Badge text="Stable" variant="success" /> |
| [FileSystem](/docs/platform/file-system/)        | A module for file system operations.                       | <Badge text="Stable" variant="success" /> |
| [KeyValueStore](/docs/platform/key-value-store/) | Manages key-value pairs for data storage.                  | <Badge text="Stable" variant="success" /> |
| [Path](/docs/platform/path/)                     | Utilities for working with file paths.                     | <Badge text="Stable" variant="success" /> |
| [PlatformLogger](/docs/platform/platformlogger/) | Log messages to a file using the FileSystem APIs.          | <Badge text="Stable" variant="success" /> |
| [Runtime](/docs/platform/runtime/)               | Run your program with built-in error handling and logging. | <Badge text="Stable" variant="success" /> |
| [Terminal](/docs/platform/terminal/)             | Tools for terminal interaction.                            | <Badge text="Stable" variant="success" /> |

### Unstable Modules

Some modules in `@effect/platform` are still in development or marked as experimental.
These features are subject to change.

| Module                                                                                               | Description                                     | Status                                      |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| [Http API](https://github.com/Effect-TS/effect/blob/main/packages/platform/README.md#http-api)       | Provide a declarative way to define HTTP APIs.  | <Badge text="Unstable" variant="caution" /> |
| [Http Client](https://github.com/Effect-TS/effect/blob/main/packages/platform/README.md#http-client) | A client for making HTTP requests.              | <Badge text="Unstable" variant="caution" /> |
| [Http Server](https://github.com/Effect-TS/effect/blob/main/packages/platform/README.md#http-server) | A server for handling HTTP requests.            | <Badge text="Unstable" variant="caution" /> |
| [Socket](https://effect-ts.github.io/effect/platform/Socket.ts.html)                                 | A module for socket-based communication.        | <Badge text="Unstable" variant="caution" /> |
| [Worker](https://effect-ts.github.io/effect/platform/Worker.ts.html)                                 | A module for running tasks in separate workers. | <Badge text="Unstable" variant="caution" /> |

For the most up-to-date documentation and details, please refer to the official [README](https://github.com/Effect-TS/effect/blob/main/packages/platform/README.md) of the package.
