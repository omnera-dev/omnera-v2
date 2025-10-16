## Overview

import { Aside } from "@astrojs/starlight/components"

To execute an effect, you can use one of the many `run` functions provided by the `Effect` module.

<Aside type="tip" title="Running Effects at the Program's Edge">
  The recommended approach is to design your program with the majority of
  its logic as Effects. It's advisable to use the `run*` functions closer
  to the "edge" of your program. This approach allows for greater
  flexibility in executing your program and building sophisticated
  effects.
</Aside>
