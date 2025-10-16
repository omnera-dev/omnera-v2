## The bundle size is HUGE!

Effect's minimum cost is about 25k of gzipped code, that chunk contains the Effect Runtime and already includes almost all the functions that you'll need in a normal app-code scenario.

From that point on Effect is tree-shaking friendly so you'll only include what you use.

Also when using Effect your own code becomes shorter and terser, so the overall cost is amortized with usage, we have apps where adopting Effect in the majority of the codebase led to reduction of the final bundle.
