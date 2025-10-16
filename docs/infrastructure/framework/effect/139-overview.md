## Overview

import { Aside } from "@astrojs/starlight/components"

A `PubSub` serves as an asynchronous message hub, allowing publishers to send messages that can be received by all current subscribers.

Unlike a [Queue](/docs/concurrency/queue/), where each value is delivered to only one consumer, a `PubSub` broadcasts each published message to all subscribers. This makes `PubSub` ideal for scenarios requiring message broadcasting rather than load distribution.
