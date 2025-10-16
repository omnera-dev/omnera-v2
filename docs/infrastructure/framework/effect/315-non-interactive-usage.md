## Non-Interactive Usage

If you prefer, `create-effect-app` can also be used in a non-interactive mode:

```sh showLineNumbers=false
create-effect-app
  (-t, --template basic | cli | monorepo)
  [--changesets]
  [--flake]
  [--eslint]
  [--workflows]
  [<project-name>]
create-effect-app
  (-e, --example http-server)
  [<project-name>]
```

Below is a breakdown of the available options to customize an Effect project template:

| Option         | Description                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| `--changesets` | Initializes your project with the Changesets package for managing version control. |
| `--flake`      | Initializes your project with a Nix flake for managing system dependencies.        |
| `--eslint`     | Includes ESLint for code formatting and linting.                                   |
| `--workflows`  | Sets up Effect's recommended GitHub Action workflows for automation.               |

# [Creating Effects](https://effect.website/docs/getting-started/creating-effects/)
