## Modeling Optional Properties

Consider a `User` model where the `"email"` property is optional and can hold a `string` value. We use the `Option<string>` type to represent this optional property:

```ts {6} twoslash
import { Option } from 'effect'

interface User {
  readonly id: number
  readonly username: string
  readonly email: Option.Option<string>
}
```

<Aside type="note" title="Property Key Always Present">
  Optionality only applies to the value of the property. The key `"email"`
  will always be present in the object, regardless of whether it has a
  value or not.
</Aside>

Here are examples of how to create `User` instances with and without an email:

**Example** (Creating Users with and without Email)

```ts twoslash
import { Option } from 'effect'

interface User {
  readonly id: number
  readonly username: string
  readonly email: Option.Option<string>
}

const withEmail: User = {
  id: 1,
  username: 'john_doe',
  email: Option.some('john.doe@example.com'),
}

const withoutEmail: User = {
  id: 2,
  username: 'jane_doe',
  email: Option.none(),
}
```
