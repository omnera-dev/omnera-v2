# "--template cloudflare-workers" selects the Cloudflare Workers template

deno init --npm hono@latest my-app --template cloudflare-workers

````

:::

## Commonly used arguments

| Argument                | Description                                                                                                                                      | Example                         |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `--template <template>` | Select a starter template and skip the interactive template prompt. Templates may include names like `bun`, `cloudflare-workers`, `vercel`, etc. | `--template cloudflare-workers` |
| `--install`             | Automatically install dependencies after the template is created.                                                                                | `--install`                     |
| `--pm <packageManager>` | Specify which package manager to run when installing dependencies. Common values: `npm`, `pnpm`, `yarn`.                                         | `--pm pnpm`                     |
| `--offline`             | Use the local cache/templates instead of fetching the latest remote templates. Useful for offline environments or deterministic local runs.      | `--offline`                     |

> [!NOTE]
> The exact set of templates and available options is maintained by the `create-hono` project. This docs page summarizes the most-used flags — see the linked repository below for the full, authoritative reference.

## Example flows

### Minimal, interactive

```bash
npm create hono@latest my-app
````

This prompts you for template and options.

### Non-interactive, pick template and package manager

```bash
npm create hono@latest my-app -- --template vercel --pm npm --install
```

This creates `my-app` using the `vercel` template, installs dependencies using `npm`, and skips the interactive prompts.

### Use offline cache (no network)

```bash
pnpm create hono@latest my-app --template deno --offline
```

## Troubleshooting & tips

- If an option appears not to be recognized, make sure you're forwarding it with `--` when using `npm create` / `npx` .
- To see the most current list of templates and flags, consult the `create-hono` repository or run the initializer locally and follow its help output.

## Links & references

- `create-hono` repository : [create-hono](https://github.com/honojs/create-hono)
