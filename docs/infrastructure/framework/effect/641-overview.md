## Overview

import { Aside } from "@astrojs/starlight/components"

Transformations are important when working with schemas. They allow you to change data from one type to another. For example, you might parse a string into a number or convert a date string into a `Date` object.

The [Schema.transform](#transform) and [Schema.transformOrFail](#transformorfail) functions help you connect two schemas so you can convert data between them.
