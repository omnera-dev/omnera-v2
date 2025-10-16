# plugins: Polar
URL: /docs/plugins/polar
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/plugins/polar.mdx

Better Auth Plugin for Payment and Checkouts using Polar

***

title: Polar
description: Better Auth Plugin for Payment and Checkouts using Polar
---------------------------------------------------------------------

[Polar](https://polar.sh) is a developer first payment infrastructure. Out of the box it provides a lot of developer first integrations for payments, checkouts and more. This plugin helps you integrate Polar with Better Auth to make your auth + payments flow seamless.

<Callout>
  This plugin is maintained by Polar team. For bugs, issues or feature requests,
  please visit the [Polar GitHub
  repo](https://github.com/polarsource/polar-adapters).
</Callout>

## Features

* Checkout Integration
* Customer Portal
* Automatic Customer creation on signup
* Event Ingestion & Customer Meters for flexible Usage Based Billing
* Handle Polar Webhooks securely with signature verification
* Reference System to associate purchases with organizations

## Installation

```bash
pnpm add better-auth @polar-sh/better-auth @polar-sh/sdk
```

## Preparation

Go to your Polar Organization Settings, and create an Organization Access Token. Add it to your environment.

```bash