## Overview

import { Aside } from "@astrojs/starlight/components"

In the [Managing Services](/docs/requirements-management/services/) page, you learned how to create effects which depend on some service to be provided in order to execute, as well as how to provide that service to an effect.

However, what if we have a service within our effect program that has dependencies on other services in order to be built? We want to avoid leaking these implementation details into the service interface.

To represent the "dependency graph" of our program and manage these dependencies more effectively, we can utilize a powerful abstraction called "Layer".

Layers act as **constructors for creating services**, allowing us to manage dependencies during construction rather than at the service level. This approach helps to keep our service interfaces clean and focused.

Let's review some key concepts before diving into the details:

| Concept     | Description                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| **service** | A reusable component providing specific functionality, used across different parts of an application.                     |
| **tag**     | A unique identifier representing a **service**, allowing Effect to locate and use it.                                     |
| **context** | A collection storing services, functioning like a map with **tags** as keys and **services** as values.                   |
| **layer**   | An abstraction for constructing **services**, managing dependencies during construction rather than at the service level. |
