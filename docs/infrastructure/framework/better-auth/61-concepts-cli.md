# concepts: CLI

URL: /docs/concepts/cli
Source: https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/concepts/cli.mdx

Built-in CLI for managing your project.

---

title: CLI
description: Built-in CLI for managing your project.

---

Better Auth comes with a built-in CLI to help you manage the database schemas, initialize your project, generate a secret key for your application, and gather diagnostic information about your setup.

## Generate

The `generate` command creates the schema required by Better Auth. If you're using a database adapter like Prisma or Drizzle, this command will generate the right schema for your ORM. If you're using the built-in Kysely adapter, it will generate an SQL file you can run directly on your database.

```bash title="Terminal"
npx @better-auth/cli@latest generate
```

### Options

- `--output` - Where to save the generated schema. For Prisma, it will be saved in prisma/schema.prisma. For Drizzle, it goes to schema.ts in your project root. For Kysely, it's an SQL file saved as schema.sql in your project root.
- `--config` - The path to your Better Auth config file. By default, the CLI will search for an auth.ts file in **./**, **./utils**, **./lib**, or any of these directories under the `src` directory.
- `--yes` - Skip the confirmation prompt and generate the schema directly.

## Migrate

The migrate command applies the Better Auth schema directly to your database. This is available if you're using the built-in Kysely adapter. For other adapters, you'll need to apply the schema using your ORM's migration tool.

```bash title="Terminal"
npx @better-auth/cli@latest migrate
```

### Options

- `--config` - The path to your Better Auth config file. By default, the CLI will search for an auth.ts file in **./**, **./utils**, **./lib**, or any of these directories under the `src` directory.
- `--yes` - Skip the confirmation prompt and apply the schema directly.

## Init

The `init` command allows you to initialize Better Auth in your project.

```bash title="Terminal"
npx @better-auth/cli@latest init
```

### Options

- `--name` - The name of your application. (defaults to the `name` property in your `package.json`).
- `--framework` - The framework your codebase is using. Currently, the only supported framework is `Next.js`.
- `--plugins` - The plugins you want to use. You can specify multiple plugins by separating them with a comma.
- `--database` - The database you want to use. Currently, the only supported database is `SQLite`.
- `--package-manager` - The package manager you want to use. Currently, the only supported package managers are `npm`, `pnpm`, `yarn`, `bun` (defaults to the manager you used to initialize the CLI).

## Info

The `info` command provides diagnostic information about your Better Auth setup and environment. Useful for debugging and sharing when seeking support.

```bash title="Terminal"
npx @better-auth/cli@latest info
```

### Output

The command displays:

- **System**: OS, CPU, memory, Node.js version
- **Package Manager**: Detected manager and version
- **Better Auth**: Version and configuration (sensitive data auto-redacted)
- **Frameworks**: Detected frameworks (Next.js, React, Vue, etc.)
- **Databases**: Database clients and ORMs (Prisma, Drizzle, etc.)

### Options

- `--config` - Path to your Better Auth config file
- `--json` - Output as JSON for sharing or programmatic use

### Examples

```bash

```
