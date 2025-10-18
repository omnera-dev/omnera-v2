# [1.0.0](https://github.com/omnera-dev/omnera-v2/compare/v0.0.1...v1.0.0) (2025-10-18)


### Bug Fixes

* resolve ESLint errors in tests and scripts ([565b826](https://github.com/omnera-dev/omnera-v2/commit/565b826835aea8ea62ae806ec0f65938d87841f2))
* resolve TypeScript errors in scripts directory ([2b897af](https://github.com/omnera-dev/omnera-v2/commit/2b897afe612ce5669a2d0136cd499f668e4b8d2b))


### Documentation

* simplify file naming conventions to two-style system ([5f27db0](https://github.com/omnera-dev/omnera-v2/commit/5f27db099fc37ba08057f57932922335c420d265))


### Features

* **agent:** add comprehensive user story validation to spec-coherence-guardian ([088d603](https://github.com/omnera-dev/omnera-v2/commit/088d603019baf778cbb870e757ad142bf54ad42e))
* implement test-only error route for 500 error page E2E test ([8561dd9](https://github.com/omnera-dev/omnera-v2/commit/8561dd9e925bc06e85bf8d61071bb8082301a9ce))
* optimize spec-coherence-guardian for agent-consumable roadmaps ([e230bfb](https://github.com/omnera-dev/omnera-v2/commit/e230bfb9ed28ed48e1a822b27daf364f66741ebd))
* restructure roadmap with modular phase files ([cff045f](https://github.com/omnera-dev/omnera-v2/commit/cff045fb997a56b5a0424d7e08814c2747ef7685))
* **roadmap:** add hierarchical grouping for Form Page inputs by type ([60c7d41](https://github.com/omnera-dev/omnera-v2/commit/60c7d417a1d82dec87c2e4a77b394517c285a772))
* **roadmap:** add live implementation tracking with schema and test status ([46b5b38](https://github.com/omnera-dev/omnera-v2/commit/46b5b3821cee20eb883ab0f2e1a21b70551cb295))
* **roadmap:** implement property-based roadmap generation with automation definitions ([a7b9655](https://github.com/omnera-dev/omnera-v2/commit/a7b96558feb4b35455277e76b3220715b830b897))
* **roadmap:** regenerate with property-based structure and user story extraction ([4bc1a42](https://github.com/omnera-dev/omnera-v2/commit/4bc1a4214a1bf2d44e71d8194d704865ee8e43b5))


### BREAKING CHANGES

* Updated file naming conventions from 3 case styles to 2

Before:
- kebab-case for 9 file types
- PascalCase for use cases, ports, repositories, errors, page components
- Mixed conventions increased cognitive load

After:
- kebab-case for 95% of files (default)
- PascalCase ONLY for page-level components (5%)

Key improvements:
- Simpler mental model: "kebab-case unless it's a page"
- File ≠ export principle: start-server.ts exports startServer
- Ecosystem aligned: matches URLs, CLI tools, React hooks, shadcn/ui
- Minimal decision fatigue: one default style
- Quick decision tree: "Is it a page? → PascalCase, else → kebab-case"

Affected conventions:
- Use cases: StartServer.ts → start-server.ts
- Ports: IConfigLoader.ts → config-loader.ts or i-config-loader.ts
- Repositories: UserRepository.ts → user-repository.ts
- Errors: InvalidConfigError.ts → invalid-config-error.ts
- Layers: AppLayer.ts → app-layer.ts

Page components remain PascalCase: DefaultHomePage.tsx ✓

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Initial release coming soon.
