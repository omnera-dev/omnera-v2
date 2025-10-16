## Creating Commands

The `Command.make` function generates a command object, which includes details such as the process name, arguments, and environment.

**Example** (Defining a Command for Directory Listing)

```ts twoslash
import { Command } from '@effect/platform'

const command = Command.make('ls', '-al')
console.log(command)
/*
{
  _id: '@effect/platform/Command',
  _tag: 'StandardCommand',
  command: 'ls',
  args: [ '-al' ],
  env: {},
  cwd: { _id: 'Option', _tag: 'None' },
  shell: false,
  gid: { _id: 'Option', _tag: 'None' },
  uid: { _id: 'Option', _tag: 'None' }
}
*/
```

This command object does not execute until run by an executor.
