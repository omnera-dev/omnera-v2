## Unexpected Errors

Unexpected errors, also referred to as _defects_, _untyped errors_, or _unrecoverable errors_, are errors that developers
do not anticipate occurring during normal program execution.
Unlike expected errors, which are considered part of a program's domain and control flow,
unexpected errors resemble unchecked exceptions and lie outside the expected behavior of the program.

Since these errors are not expected, Effect **does not track** them at the type level.
However, the Effect runtime does keep track of these errors and provides several methods to aid in recovering from unexpected errors.

# [Unexpected Errors](https://effect.website/docs/error-management/unexpected-errors/)
