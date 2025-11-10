# Import Mapping - Folder Structure Refactoring

This document maps old import paths to new import paths for the folder structure refactoring.
Use this for automated find-replace during Phase 3.

## Presentation-Level Utilities (utils/ → feature directories)

### Rendering

| Old Path                                  | New Path                                      |
| ----------------------------------------- | --------------------------------------------- |
| `@/presentation/utils/render-homepage`    | `@/presentation/rendering/render-homepage`    |
| `@/presentation/utils/render-error-pages` | `@/presentation/rendering/render-error-pages` |

### Styling

| Old Path                                  | New Path                                    |
| ----------------------------------------- | ------------------------------------------- |
| `@/presentation/utils/cn`                 | `@/presentation/styling/cn`                 |
| `@/presentation/utils/color-utils`        | `@/presentation/styling/color-utils`        |
| `@/presentation/utils/parse-style`        | `@/presentation/styling/parse-style`        |
| `@/presentation/utils/style-utils`        | `@/presentation/styling/style-utils`        |
| `@/presentation/utils/variant-classes`    | `@/presentation/styling/variant-classes`    |
| `@/presentation/utils/animation-composer` | `@/presentation/styling/animation-composer` |

### Theming

| Old Path                                                        | New Path                                                    |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| `@/presentation/utils/theme-generator`                          | `@/presentation/theming/theme-generator`                    |
| `@/presentation/utils/theme-generators/animation-generator`     | `@/presentation/theming/generators/animation-generator`     |
| `@/presentation/utils/theme-generators/border-radius-generator` | `@/presentation/theming/generators/border-radius-generator` |
| `@/presentation/utils/theme-generators/color-generator`         | `@/presentation/theming/generators/color-generator`         |
| `@/presentation/utils/theme-generators/shadow-generator`        | `@/presentation/theming/generators/shadow-generator`        |
| `@/presentation/utils/theme-generators/spacing-generator`       | `@/presentation/theming/generators/spacing-generator`       |
| `@/presentation/utils/theme-generators/theme-generator`         | `@/presentation/theming/generators/theme-generator`         |
| `@/presentation/utils/theme-generators/typography-generator`    | `@/presentation/theming/generators/typography-generator`    |

### Translations

| Old Path                                    | New Path                                           |
| ------------------------------------------- | -------------------------------------------------- |
| `@/presentation/utils/translation-resolver` | `@/presentation/translations/translation-resolver` |
| `@/presentation/utils/block-utils`          | `@/presentation/translations/block-utils`          |

### Scripts

| Old Path                                | New Path                                  |
| --------------------------------------- | ----------------------------------------- |
| `@/presentation/utils/script-renderers` | `@/presentation/scripts/script-renderers` |

### Generic Utilities

| Old Path                            | New Path                                |
| ----------------------------------- | --------------------------------------- |
| `@/presentation/utils/string-utils` | `@/presentation/utilities/string-utils` |

## Sections Utils (sections/utils/ → feature directories)

### Block System

| Old Path                                                           | New Path                                                            | Barrel Export                               |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------- |
| `@/presentation/components/sections/utils/block-reference-handler` | `@/presentation/components/sections/blocks/block-reference-handler` | `@/presentation/components/sections/blocks` |
| `@/presentation/components/sections/utils/block-resolution`        | `@/presentation/components/sections/blocks/block-resolution`        | `@/presentation/components/sections/blocks` |

### Props Building

| Old Path                                                           | New Path                                                           | Barrel Export                              |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------ |
| `@/presentation/components/sections/utils/props-builder`           | `@/presentation/components/sections/props/props-builder`           | `@/presentation/components/sections/props` |
| `@/presentation/components/sections/utils/props-builder-config`    | `@/presentation/components/sections/props/props-builder-config`    | `@/presentation/components/sections/props` |
| `@/presentation/components/sections/utils/component-props-builder` | `@/presentation/components/sections/props/component-props-builder` | `@/presentation/components/sections/props` |
| `@/presentation/components/sections/utils/element-props`           | `@/presentation/components/sections/props/element-props`           | `@/presentation/components/sections/props` |
| `@/presentation/components/sections/utils/component-builder`       | `@/presentation/components/sections/props/component-builder`       | `@/presentation/components/sections/props` |

### Component Rendering

| Old Path                                                             | New Path                                                                 | Barrel Export                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------- |
| `@/presentation/components/sections/utils/component-registry`        | `@/presentation/components/sections/rendering/component-registry`        | `@/presentation/components/sections/rendering` |
| `@/presentation/components/sections/utils/component-type-dispatcher` | `@/presentation/components/sections/rendering/component-type-dispatcher` | `@/presentation/components/sections/rendering` |
| `@/presentation/components/sections/utils/component-dispatch-config` | `@/presentation/components/sections/rendering/component-dispatch-config` | `@/presentation/components/sections/rendering` |

### Component Styling

| Old Path                                                              | New Path                                                                | Barrel Export                                |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| `@/presentation/components/sections/utils/style-processor`            | `@/presentation/components/sections/styling/style-processor`            | `@/presentation/components/sections/styling` |
| `@/presentation/components/sections/utils/component-styling`          | `@/presentation/components/sections/styling/component-styling`          | `@/presentation/components/sections/styling` |
| `@/presentation/components/sections/utils/class-builders`             | `@/presentation/components/sections/styling/class-builders`             | `@/presentation/components/sections/styling` |
| `@/presentation/components/sections/utils/shadow-resolver`            | `@/presentation/components/sections/styling/shadow-resolver`            | `@/presentation/components/sections/styling` |
| `@/presentation/components/sections/utils/spacing-resolver`           | `@/presentation/components/sections/styling/spacing-resolver`           | `@/presentation/components/sections/styling` |
| `@/presentation/components/sections/utils/animation-composer`         | **DELETE** (duplicate)                                                  | N/A                                          |
| `@/presentation/components/sections/utils/animation-composer-wrapper` | `@/presentation/components/sections/styling/animation-composer-wrapper` | `@/presentation/components/sections/styling` |
| `@/presentation/components/sections/utils/theme-tokens`               | `@/presentation/components/sections/styling/theme-tokens`               | `@/presentation/components/sections/styling` |

### Component Translations

| Old Path                                                         | New Path                                                                | Barrel Export                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| `@/presentation/components/sections/utils/translation-handler`   | `@/presentation/components/sections/translations/translation-handler`   | `@/presentation/components/sections/translations` |
| `@/presentation/components/sections/utils/variable-substitution` | `@/presentation/components/sections/translations/variable-substitution` | `@/presentation/components/sections/translations` |

## Pages Utils (pages/utils/ → pages/)

| Old Path                                                 | New Path                                           |
| -------------------------------------------------------- | -------------------------------------------------- |
| `@/presentation/components/pages/utils/PageBodyScripts`  | `@/presentation/components/pages/PageBodyScripts`  |
| `@/presentation/components/pages/utils/PageBodyStyles`   | `@/presentation/components/pages/PageBodyStyles`   |
| `@/presentation/components/pages/utils/PageHead`         | `@/presentation/components/pages/PageHead`         |
| `@/presentation/components/pages/utils/PageLangResolver` | `@/presentation/components/pages/PageLangResolver` |
| `@/presentation/components/pages/utils/PageLayout`       | `@/presentation/components/pages/PageLayout`       |
| `@/presentation/components/pages/utils/PageMain`         | `@/presentation/components/pages/PageMain`         |
| `@/presentation/components/pages/utils/PageMetadata`     | `@/presentation/components/pages/PageMetadata`     |
| `@/presentation/components/pages/utils/PageScripts`      | `@/presentation/components/pages/PageScripts`      |
| `@/presentation/components/pages/utils/SectionRenderer`  | `@/presentation/components/pages/SectionRenderer`  |
| `@/presentation/components/pages/utils/SectionSpacing`   | `@/presentation/components/pages/SectionSpacing`   |

## Metadata Utils (metadata/utils/ → metadata/)

| Old Path                                                            | New Path                                                      |
| ------------------------------------------------------------------- | ------------------------------------------------------------- |
| `@/presentation/components/metadata/utils/analytics-builders`       | `@/presentation/components/metadata/analytics-builders`       |
| `@/presentation/components/metadata/utils/custom-elements-builders` | `@/presentation/components/metadata/custom-elements-builders` |

## Relative Import Patterns

For files using relative imports (e.g., `./utils/`, `../utils/`), use these patterns:

### From components/sections/ files

```
OLD: from './utils/block-reference-handler'
NEW: from './blocks/block-reference-handler'
     OR from './blocks' (barrel export)

OLD: from './utils/props-builder'
NEW: from './props/props-builder'
     OR from './props' (barrel export)

OLD: from './utils/component-registry'
NEW: from './rendering/component-registry'
     OR from './rendering' (barrel export)

OLD: from './utils/style-processor'
NEW: from './styling/style-processor'
     OR from './styling' (barrel export)

OLD: from './utils/translation-handler'
NEW: from './translations/translation-handler'
     OR from './translations' (barrel export)
```

### From components/pages/ files

```
OLD: from './utils/PageHead'
NEW: from './PageHead'

OLD: from './utils/PageBodyScripts'
NEW: from './PageBodyScripts'
```

### From components/metadata/ files

```
OLD: from './utils/analytics-builders'
NEW: from './analytics-builders'
```

## Find-Replace Commands (Phase 3)

Use these regex patterns for automated replacement:

### Presentation-level utilities

```bash
# Rendering
from '@/presentation/utils/render-homepage'
  → from '@/presentation/rendering/render-homepage'

from '@/presentation/utils/render-error-pages'
  → from '@/presentation/rendering/render-error-pages'

# Styling
from '@/presentation/utils/cn'
  → from '@/presentation/styling/cn'

from '@/presentation/utils/animation-composer'
  → from '@/presentation/styling/animation-composer'

# Theming
from '@/presentation/utils/theme-generator'
  → from '@/presentation/theming/theme-generator'

from '@/presentation/utils/theme-generators/
  → from '@/presentation/theming/generators/

# Translations
from '@/presentation/utils/translation-resolver'
  → from '@/presentation/translations/translation-resolver'

# Utilities
from '@/presentation/utils/string-utils'
  → from '@/presentation/utilities/string-utils'
```

### Sections utils (absolute imports)

```bash
from '@/presentation/components/sections/utils/block-reference-handler'
  → from '@/presentation/components/sections/blocks/block-reference-handler'

from '@/presentation/components/sections/utils/props-builder'
  → from '@/presentation/components/sections/props/props-builder'

from '@/presentation/components/sections/utils/component-registry'
  → from '@/presentation/components/sections/rendering/component-registry'

from '@/presentation/components/sections/utils/style-processor'
  → from '@/presentation/components/sections/styling/style-processor'

from '@/presentation/components/sections/utils/translation-handler'
  → from '@/presentation/components/sections/translations/translation-handler'
```

### Sections utils (relative imports - from within sections/)

```bash
from './utils/block-reference-handler'
  → from './blocks/block-reference-handler'

from './utils/props-builder'
  → from './props/props-builder'

from './utils/component-registry'
  → from './rendering/component-registry'

from './utils/style-processor'
  → from './styling/style-processor'

from './utils/translation-handler'
  → from './translations/translation-handler'
```

### Pages utils

```bash
from '@/presentation/components/pages/utils/
  → from '@/presentation/components/pages/

from './utils/Page
  → from './Page

from '../pages/utils/
  → from '../pages/
```

### Metadata utils

```bash
from '@/presentation/components/metadata/utils/
  → from '@/presentation/components/metadata/

from './utils/analytics-builders'
  → from './analytics-builders'
```

## Files to Delete

- `src/presentation/components/sections/utils/animation-composer.ts` (duplicate)

## Directories to Delete (After moving all files)

- `src/presentation/utils/`
- `src/presentation/utils/theme-generators/`
- `src/presentation/components/sections/utils/`
- `src/presentation/components/pages/utils/`
- `src/presentation/components/metadata/utils/`
