## Overview

import { Aside } from "@astrojs/starlight/components"

In JavaScript, numbers are typically stored as 64-bit floating-point values. While floating-point numbers are fast and versatile, they can introduce small rounding errors. These are often hard to notice in everyday usage but can become problematic in areas like finance or statistics, where small inaccuracies may lead to larger discrepancies over time.

By using the BigDecimal module, you can avoid these issues and perform calculations with a higher degree of precision.

The `BigDecimal` data type can represent real numbers with a large number of decimal places, preventing the common errors of floating-point math (for example, 0.1 + 0.2 ≠ 0.3).
