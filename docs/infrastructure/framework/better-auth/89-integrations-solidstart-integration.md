# integrations: SolidStart Integration

URL: /docs/integrations/solid-start
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/integrations/solid-start.mdx

Integrate Better Auth with SolidStart.

---

title: SolidStart Integration
description: Integrate Better Auth with SolidStart.

---

Before you start, make sure you have a Better Auth instance configured. If you haven't done that yet, check out the [installation](/docs/installation).

### Mount the handler

We need to mount the handler to SolidStart server. Put the following code in your `*auth.ts` file inside `/routes/api/auth` folder.

```ts title="*auth.ts"
import { auth } from '~/lib/auth'
import { toSolidStartHandler } from 'better-auth/solid-start'

export const { GET, POST } = toSolidStartHandler(auth)
```
