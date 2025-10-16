## Designing the Dependency Graph

Let's imagine that we are building a web application. We could imagine that the dependency graph for an application where we need to manage configuration, logging, and database access might look something like this:

- The `Config` service provides application configuration.
- The `Logger` service depends on the `Config` service.
- The `Database` service depends on both the `Config` and `Logger` services.

Our goal is to build the `Database` service along with its direct and indirect dependencies. This means we need to ensure that the `Config` service is available for both `Logger` and `Database`, and then provide these dependencies to the `Database` service.
