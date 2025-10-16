## Overview

import { Aside, Badge } from "@astrojs/starlight/components"

Configuration is an essential aspect of any cloud-native application. Effect simplifies the process of managing configuration by offering a convenient interface for configuration providers.

The configuration front-end in Effect enables ecosystem libraries and applications to specify their configuration requirements in a declarative manner. It offloads the complex tasks to a `ConfigProvider`, which can be supplied by third-party libraries.

Effect comes bundled with a straightforward default `ConfigProvider` that retrieves configuration data from environment variables. This default provider can be used during development or as a starting point before transitioning to more advanced configuration providers.

To make our application configurable, we need to understand three essential elements:

- **Config Description**: We describe the configuration data using an instance of `Config<A>`. If the configuration data is simple, such as a `string`, `number`, or `boolean`, we can use the built-in functions provided by the `Config` module. For more complex data types like [HostPort](#custom-configuration-types), we can combine primitive configs to create a custom configuration description.

- **Config Frontend**: We utilize the instance of `Config<A>` to load the configuration data described by the instance (a `Config` is, in itself, an effect). This process leverages the current `ConfigProvider` to retrieve the configuration.

- **Config Backend**: The `ConfigProvider` serves as the underlying engine that manages the configuration loading process. Effect comes with a default config provider as part of its default services. This default provider reads the configuration data from environment variables. If we want to use a custom config provider, we can utilize the `Effect.withConfigProvider` API to configure the Effect runtime accordingly.
