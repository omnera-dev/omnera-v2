## Overview

import { Aside } from "@astrojs/starlight/components"

The Cron module lets you define schedules in a style similar to [UNIX cron expressions](https://en.wikipedia.org/wiki/Cron).
It also supports partial constraints (e.g., certain months or weekdays), time zone awareness through the [DateTime](/docs/data-types/datetime/) module, and robust error handling.

This module helps you:

- **Create** a `Cron` instance from individual parts.
- **Parse and validate** cron expressions.
- **Match** existing dates to see if they satisfy a given cron schedule.
- **Find** the next occurrence of a schedule after a given date.
- **Iterate** over future dates that match a schedule.
- **Convert** a `Cron` instance to a `Schedule` for use in effectful programs.
