## Overview

import { Aside } from "@astrojs/starlight/components"

Working with dates and times in JavaScript can be challenging. The built-in `Date` object mutates its internal state, and time zone handling can be confusing. These design choices can lead to errors when working on applications that rely on date-time accuracy, such as scheduling systems, timestamping services, or logging utilities.

The DateTime module aims to address these limitations by offering:

- **Immutable Data**: Each `DateTime` is an immutable structure, reducing mistakes related to in-place mutations.
- **Time Zone Support**: `DateTime` provides robust support for time zones, including automatic daylight saving time adjustments.
- **Arithmetic Operations**: You can perform arithmetic operations on `DateTime` instances, such as adding or subtracting durations.
