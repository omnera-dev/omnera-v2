## Overview

import {
Aside,
Tabs,
TabItem,
Steps
} from "@astrojs/starlight/components"

<Aside type="caution" title="Experimental Module">
  The Micro module is currently in its experimental stages. We encourage
  your feedback to further improve its features.
</Aside>

The Micro module is designed as a lighter alternative to the standard Effect module, tailored for situations where it is beneficial to reduce the bundle size.

This module is standalone and does not include more complex functionalities such as [Layer](/docs/requirements-management/layers/), [Ref](/docs/state-management/ref/), [Queue](/docs/concurrency/queue/), and [Deferred](/docs/concurrency/deferred/). This feature set makes Micro especially suitable for libraries that wish to utilize Effect functionalities while keeping the bundle size to a minimum, particularly for those aiming to provide `Promise`-based APIs.

Micro also supports use cases where a client application uses Micro, and a server employs the full suite of Effect features, maintaining both compatibility and logical consistency across various application components.

Integrating Micro adds a minimal footprint to your bundle, starting at **5kb gzipped**, which may increase depending on the features you use.

<Aside type="danger" title="Bundle Size">
  Utilizing major Effect modules beyond basic data modules like `Option`,
  `Either`, `Array`, will incorporate the Effect runtime into your bundle,
  negating the benefits of Micro.
</Aside>
