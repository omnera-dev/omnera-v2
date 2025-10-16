# authentication: Zoom
URL: /docs/authentication/zoom
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/authentication/zoom.mdx

Zoom provider setup and usage.

***

title: Zoom
description: Zoom provider setup and usage.
-------------------------------------------

<Steps>
  <Step>
    ### Create a Zoom App from Marketplace

    1. Visit [Zoom Marketplace](https://marketplace.zoom.us).

    2. Hover on the `Develop` button and select `Build App`

    3. Select `General App` and click `Create`
  </Step>

  <Step>
    ### Configure your Zoom App

    Ensure that you are in the `Basic Information` of your app settings.

    1. Under `Select how the app is managed`, choose `User-managed`

    2. Under `App Credentials`, copy your `Client ID` and `Client Secret` and store them in a safe location

    3. Under `OAuth Information` -> `OAuth Redirect URL`, add your Callback URL. For example,

       ```
       http://localhost:3000/api/auth/callback/zoom
       ```

       <Callout>
         For production, you should set it to the URL of your application. If you change the base
         path of the auth routes, you should update the redirect URL accordingly.
       </Callout>

    Skip to the `Scopes` section, then

    1. Click the `Add Scopes` button
    2. Search for `user:read:user` (View a user) and select it
    3. Add any other scopes your applications needs and click `Done`
  </Step>

  <Step>
    ### Configure the provider

    To configure the provider, you need to import the provider and pass it to the `socialProviders` option of the auth instance.

    ```ts title="auth.ts"
    import { betterAuth } from "better-auth"

    export const auth = betterAuth({
      socialProviders: {
        zoom: { // [!code highlight]
          clientId: process.env.ZOOM_CLIENT_ID as string, // [!code highlight]
          clientSecret: process.env.ZOOM_CLIENT_SECRET as string, // [!code highlight]
        }, // [!code highlight]
      },
    })
    ```
  </Step>

  <Step>
    ### Sign In with Zoom

    To sign in with Zoom, you can use the `signIn.social` function provided by the client.
    You will need to specify `zoom` as the provider.

    ```ts title="auth-client.ts"
    import { createAuthClient } from "better-auth/client"
    const authClient =  createAuthClient()

    const signIn = async () => {
      const data = await authClient.signIn.social({
        provider: "zoom"
      })
    }
    ```
  </Step>
</Steps>


