## Importing Micro

Micro is a part of the Effect library and can be imported just like any other module:

```ts showLineNumbers=false
import { Micro } from 'effect'
```

You can also import it using a namespace import like this:

```ts showLineNumbers=false
import * as Micro from 'effect/Micro'
```

Both forms of import allow you to access the functionalities provided by the `Micro` module.

However an important consideration is **tree shaking**, which refers to a process that eliminates unused code during the bundling of your application.
Named imports may generate tree shaking issues when a bundler doesn't support deep scope analysis.

Here are some bundlers that support deep scope analysis and thus don't have issues with named imports:

- Rollup
- Webpack 5+
