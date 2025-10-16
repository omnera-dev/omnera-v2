## Type safety

Let's start by comparing the types of `Promise` and `Effect`. The type parameter `A` represents the resolved value of the operation:

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts showLineNumbers=false
Promise<A>
```

</TabItem>

<TabItem label="Effect">

```ts showLineNumbers=false
Effect<A, Error, Context>
```

</TabItem>

</Tabs>

Here's what sets `Effect` apart:

- It allows you to track the types of errors statically through the type parameter `Error`. For more information about error management in `Effect`, see [Expected Errors](/docs/error-management/expected-errors/).
- It allows you to track the types of required dependencies statically through the type parameter `Context`. For more information about context management in `Effect`, see [Managing Services](/docs/requirements-management/services/).
