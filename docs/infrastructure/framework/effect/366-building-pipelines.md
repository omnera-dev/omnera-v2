## Building Pipelines

| Effect             | Micro             | ⚠️                                                      |
| ------------------ | ----------------- | ------------------------------------------------------- |
| `Effect.andThen`   | `Micro.andThen`   | doesn't handle `Promise` or `() => Promise` as argument |
| `Effect.tap`       | `Micro.tap`       | doesn't handle `() => Promise` as argument              |
| `Effect.all`       | `Micro.all`       | no `batching` and `mode` options                        |
| `Effect.forEach`   | `Micro.forEach`   | no `batching` option                                    |
| `Effect.filter`    | `Micro.filter`    | no `batching` option                                    |
| `Effect.filterMap` | `Micro.filterMap` | the filter is effectful                                 |
