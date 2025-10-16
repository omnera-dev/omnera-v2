## Pretty Printing

Clear and readable error messages are key for effective debugging. The `Cause.pretty` function helps by formatting error messages in a structured way, making it easier to understand failure details.

**Example** (Using `Cause.pretty` for Readable Error Messages)

```ts twoslash
import { Cause, FiberId } from 'effect'

console.log(Cause.pretty(Cause.empty))
/*
Output:
All fibers interrupted without errors.
*/

console.log(Cause.pretty(Cause.fail(new Error('my fail message'))))
/*
Output:
Error: my fail message
    ...stack trace...
*/

console.log(Cause.pretty(Cause.die('my die message')))
/*
Output:
Error: my die message
*/

console.log(Cause.pretty(Cause.interrupt(FiberId.make(1, 0))))
/*
Output:
All fibers interrupted without errors.
*/

console.log(Cause.pretty(Cause.sequential(Cause.fail('fail1'), Cause.fail('fail2'))))
/*
Output:
Error: fail1
Error: fail2
*/
```
