## Overview

Yieldable Errors are special types of errors that can be yielded directly within a generator function using [Effect.gen](/docs/getting-started/using-generators/).
These errors allow you to handle them intuitively, without needing to explicitly invoke [Effect.fail](/docs/getting-started/creating-effects/#fail). This simplifies how you manage custom errors in your code.
