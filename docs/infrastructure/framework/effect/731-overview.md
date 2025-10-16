## Overview

import { Aside } from "@astrojs/starlight/components"

In most cases, we want our unit tests to run as quickly as possible. Waiting for real time to pass can slow down our tests significantly. Effect provides a handy tool called `TestClock` that allows us to **control time during testing**. This means we can efficiently and predictably test code that involves time without having to wait for the actual time to pass.
