# authentication: Email & Password

URL: /docs/authentication/email-password
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/authentication/email-password.mdx

Implementing email and password authentication with Better Auth.

---

title: Email & Password
description: Implementing email and password authentication with Better Auth.

---

Email and password authentication is a common method used by many applications. Better Auth provides a built-in email and password authenticator that you can easily integrate into your project.

<Callout type="info">
  If you prefer username-based authentication, check out the{" "}
  <Link href="/docs/plugins/username">username plugin</Link>. It extends the
  email and password authenticator with username support.
</Callout>

## Enable Email and Password

To enable email and password authentication, you need to set the `emailAndPassword.enabled` option to `true` in the `auth` configuration.

```ts title="auth.ts"
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  emailAndPassword: {
    // [!code highlight]
    enabled: true, // [!code highlight]
  }, // [!code highlight]
})
```

<Callout type="info">
  If it's not enabled, it'll not allow you to sign in or sign up with email and
  password.
</Callout>

## Usage

### Sign Up

To sign a user up, you can use the `signUp.email` function provided by the client.

### Client Side

```ts
const { data, error } = await authClient.signUp.email({
    name: John Doe,
    email: john.doe@example.com,
    password: password1234,
    image: https://example.com/image.png, // required
    callbackURL: https://example.com/callback, // required
});
```

### Server Side

```ts
const data = await auth.api.signUpEmail({
    body: {
        name: John Doe,
        email: john.doe@example.com,
        password: password1234,
        image: https://example.com/image.png, // required
        callbackURL: https://example.com/callback, // required
    }
});
```

### Type Definition

```ts
type signUpEmail = {
    /**
     * The name of the user.
     */
    name: string = "John Doe"
    /**
     * The email address of the user.
     */
    email: string = "john.doe@example.com"
    /**
     * The password of the user. It should be at least 8 characters long and max 128 by default.
     */
    password: string = "password1234"
    /**
     * An optional profile image of the user.
     */
    image?: string = "https://example.com/image.png"
    /**
     * An optional URL to redirect to after the user signs up.
     */
    callbackURL?: string = "https://example.com/callback"

}
```

<Callout>
  These are the default properties for the sign up email endpoint, however it's possible that with [additional fields](/docs/concepts/typescript#additional-fields) or special plugins you can pass more properties to the endpoint.
</Callout>

### Sign In

To sign a user in, you can use the `signIn.email` function provided by the client.

### Client Side

```ts
const { data, error } = await authClient.signIn.email({
    email: john.doe@example.com,
    password: password1234,
    rememberMe, // required
    callbackURL: https://example.com/callback, // required
});
```

### Server Side

```ts
const data = await auth.api.signInEmail({
    body: {
        email: john.doe@example.com,
        password: password1234,
        rememberMe, // required
        callbackURL: https://example.com/callback, // required
    },
    // This endpoint requires session cookies.
    headers: await headers()
});
```

### Type Definition

```ts
type signInEmail = {
    /**
     * The email address of the user.
     */
    email: string = "john.doe@example.com"
    /**
     * The password of the user. It should be at least 8 characters long and max 128 by default.
     */
    password: string = "password1234"
    /**
     * If false, the user will be signed out when the browser is closed. (optional) (default: true)
     */
    rememberMe?: boolean = true
    /**
     * An optional URL to redirect to after the user signs in. (optional)
     */
    callbackURL?: string = "https://example.com/callback"

}
```

<Callout>
  These are the default properties for the sign in email endpoint, however it's possible that with [additional fields](/docs/concepts/typescript#additional-fields) or special plugins you can pass different properties to the endpoint.
</Callout>

### Sign Out

To sign a user out, you can use the `signOut` function provided by the client.

### Client Side

```ts
const { data, error } = await authClient.signOut({})
```

### Server Side

```ts
await auth.api.signOut({
  // This endpoint requires session cookies.
  headers: await headers(),
})
```

### Type Definition

```ts
type signOut = {}
```

you can pass `fetchOptions` to redirect onSuccess

```ts title="auth-client.ts"
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push('/login') // redirect to login page
    },
  },
})
```

### Email Verification

To enable email verification, you need to pass a function that sends a verification email with a link. The `sendVerificationEmail` function takes a data object with the following properties:

- `user`: The user object.
- `url`: The URL to send to the user which contains the token.
- `token`: A verification token used to complete the email verification.

and a `request` object as the second parameter.

```ts title="auth.ts"
import { betterAuth } from 'better-auth'
import { sendEmail } from './email' // your email sending function

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}`,
      })
    },
  },
})
```

On the client side you can use `sendVerificationEmail` function to send verification link to user. This will trigger the `sendVerificationEmail` function you provided in the `auth` configuration.

Once the user clicks on the link in the email, if the token is valid, the user will be redirected to the URL provided in the `callbackURL` parameter. If the token is invalid, the user will be redirected to the URL provided in the `callbackURL` parameter with an error message in the query string `?error=invalid_token`.

#### Require Email Verification

If you enable require email verification, users must verify their email before they can log in. And every time a user tries to sign in, sendVerificationEmail is called.

<Callout>
  This only works if you have sendVerificationEmail implemented and if the user
  is trying to sign in with email and password.
</Callout>

```ts title="auth.ts"
export const auth = betterAuth({
  emailAndPassword: {
    requireEmailVerification: true,
  },
})
```

If a user tries to sign in without verifying their email, you can handle the error and show a message to the user.

```ts title="auth-client.ts"
await authClient.signIn.email(
  {
    email: 'email@example.com',
    password: 'password',
  },
  {
    onError: (ctx) => {
      // Handle the error
      if (ctx.error.status === 403) {
        alert('Please verify your email address')
      }
      //you can also show the original error message
      alert(ctx.error.message)
    },
  }
)
```

#### Triggering manually Email Verification

You can trigger the email verification manually by calling the `sendVerificationEmail` function.

```ts
await authClient.sendVerificationEmail({
  email: 'user@email.com',
  callbackURL: '/', // The redirect URL after verification
})
```

### Request Password Reset

To allow users to reset a password first you need to provide `sendResetPassword` function to the email and password authenticator. The `sendResetPassword` function takes a data object with the following properties:

- `user`: The user object.
- `url`: The URL to send to the user which contains the token.
- `token`: A verification token used to complete the password reset.

and a `request` object as the second parameter.

```ts title="auth.ts"
import { betterAuth } from 'better-auth'
import { sendEmail } from './email' // your email sending function

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`,
      })
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`)
    },
  },
})
```

Additionally, you can provide an `onPasswordReset` callback to execute logic after a password has been successfully reset.

Once you configured your server you can call `requestPasswordReset` function to send reset password link to user. If the user exists, it will trigger the `sendResetPassword` function you provided in the auth config.

### Client Side

```ts
const { data, error } = await authClient.requestPasswordReset({
    email: john.doe@example.com,
    redirectTo: https://example.com/reset-password, // required
});
```

### Server Side

```ts
const data = await auth.api.requestPasswordReset({
    body: {
        email: john.doe@example.com,
        redirectTo: https://example.com/reset-password, // required
    }
});
```

### Type Definition

```ts
type requestPasswordReset = {
    /**
     * The email address of the user to send a password reset email to
     */
    email: string = "john.doe@example.com"
    /**
     * The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN
     */
    redirectTo?: string = "https://example.com/reset-password"

}
```

When a user clicks on the link in the email, they will be redirected to the reset password page. You can add the reset password page to your app. Then you can use `resetPassword` function to reset the password. It takes an object with the following properties:

- `newPassword`: The new password of the user.

```ts title="auth-client.ts"
const { data, error } = await authClient.resetPassword({
  newPassword: 'password1234',
  token,
})
```

### Client Side

```ts
const { data, error } = await authClient.resetPassword({
  newPassword: password1234,
  token,
})
```

### Server Side

```ts
const data = await auth.api.resetPassword({
  body: {
    newPassword: password1234,
    token,
  },
})
```

### Type Definition

```ts
type resetPassword = {
    /**
     * The new password to set
     */
    newPassword: string = "password1234"
    /**
     * The token to reset the password
     */
    token: string

}
```

### Update password

A user's password isn't stored in the user table. Instead, it's stored in the account table. To change the password of a user, you can use one of the following approaches:

### Client Side

```ts
const { data, error } = await authClient.changePassword({
  newPassword: newpassword1234,
  currentPassword: oldpassword1234,
  revokeOtherSessions, // required
})
```

### Server Side

```ts
const data = await auth.api.changePassword({
  body: {
    newPassword: newpassword1234,
    currentPassword: oldpassword1234,
    revokeOtherSessions, // required
  },
  // This endpoint requires session cookies.
  headers: await headers(),
})
```

### Type Definition

```ts
type changePassword = {
    /**
     * The new password to set
     */
    newPassword: string = "newpassword1234"
    /**
     * The current user password
     */
    currentPassword: string = "oldpassword1234"
    /**
     * When set to true, all other active sessions for this user will be invalidated
     */
    revokeOtherSessions?: boolean = true

}
```

### Configuration

**Password**

Better Auth stores passwords inside the `account` table with `providerId` set to `credential`.

**Password Hashing**: Better Auth uses `scrypt` to hash passwords. The `scrypt` algorithm is designed to be slow and memory-intensive to make it difficult for attackers to brute force passwords. OWASP recommends using `scrypt` if `argon2id` is not available. We decided to use `scrypt` because it's natively supported by Node.js.

You can pass custom password hashing algorithm by setting `passwordHasher` option in the `auth` configuration.

```ts title="auth.ts"
import { betterAuth } from "better-auth"
import { scrypt } from "scrypt"

export const auth = betterAuth({
    //...rest of the options
    emailAndPassword: {
        password: {
            hash: // your custom password hashing function
            verify: // your custom password verification function
        }
    }
})
```

<TypeTable
type={{
  enabled: {
    description: "Enable email and password authentication.",
    type: "boolean",
    default: "false",
  },
  disableSignUp: {
    description: "Disable email and password sign up.",
    type: "boolean",
    default: "false"
  },
  minPasswordLength: {
    description: "The minimum length of a password.",
    type: "number",
    default: 8,
  },
  maxPasswordLength: {
    description: "The maximum length of a password.",
    type: "number",
    default: 128,
  },
  sendResetPassword: {
    description:
      "Sends a password reset email. It takes a function that takes two parameters: token and user.",
    type: "function",
  },
  onPasswordReset: {
    description:
      "A callback function that is triggered when a user's password is changed successfully.",
    type: "function",
  },
  resetPasswordTokenExpiresIn: {
    description:
      "Number of seconds the reset password token is valid for.",
    type: "number",
    default: 3600
  },
  password: {
    description: "Password configuration.",
    type: "object",
    properties: {
      hash: {
        description: "custom password hashing function",
        type: "function",
      },
      verify: {
        description: "custom password verification function",
        type: "function",
      },
    },
  },
}}
/>
