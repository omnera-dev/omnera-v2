#!/bin/bash
# Import path update script for folder structure refactoring

set -e  # Exit on error

echo "🔄 Updating import paths..."

# Presentation-level utilities

echo "📁 Updating styling imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/cn'|from '@/presentation/styling/cn'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/color-utils'|from '@/presentation/styling/color-utils'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/style-utils'|from '@/presentation/styling/style-utils'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/parse-style'|from '@/presentation/styling/parse-style'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/variant-classes'|from '@/presentation/styling/variant-classes'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/animation-composer'|from '@/presentation/styling/animation-composer'|g" {} \;

echo "📁 Updating theming imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/theme-generator'|from '@/presentation/theming/theme-generator'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/theme-generators/|from '@/presentation/theming/generators/|g" {} \;

echo "📁 Updating translation imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/translation-resolver'|from '@/presentation/translations/translation-resolver'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/block-utils'|from '@/presentation/translations/block-utils'|g" {} \;

echo "📁 Updating utilities imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/string-utils'|from '@/presentation/utilities/string-utils'|g" {} \;

echo "📁 Updating rendering imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/render-homepage'|from '@/presentation/rendering/render-homepage'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/render-error-pages'|from '@/presentation/rendering/render-error-pages'|g" {} \;

echo "📁 Updating script imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/utils/script-renderers'|from '@/presentation/scripts/script-renderers'|g" {} \;

# Sections utils - absolute imports
echo "📁 Updating sections/blocks imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/block-reference-handler'|from '@/presentation/components/sections/blocks/block-reference-handler'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/block-resolution'|from '@/presentation/components/sections/blocks/block-resolution'|g" {} \;

echo "📁 Updating sections/props imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/props-builder'|from '@/presentation/components/sections/props/props-builder'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/props-builder-config'|from '@/presentation/components/sections/props/props-builder-config'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/component-props-builder'|from '@/presentation/components/sections/props/component-props-builder'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/element-props'|from '@/presentation/components/sections/props/element-props'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/component-builder'|from '@/presentation/components/sections/props/component-builder'|g" {} \;

echo "📁 Updating sections/rendering imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/component-registry'|from '@/presentation/components/sections/rendering/component-registry'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/component-type-dispatcher'|from '@/presentation/components/sections/rendering/component-type-dispatcher'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/component-dispatch-config'|from '@/presentation/components/sections/rendering/component-dispatch-config'|g" {} \;

echo "📁 Updating sections/styling imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/style-processor'|from '@/presentation/components/sections/styling/style-processor'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/component-styling'|from '@/presentation/components/sections/styling/component-styling'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/class-builders'|from '@/presentation/components/sections/styling/class-builders'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/shadow-resolver'|from '@/presentation/components/sections/styling/shadow-resolver'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/spacing-resolver'|from '@/presentation/components/sections/styling/spacing-resolver'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/animation-composer-wrapper'|from '@/presentation/components/sections/styling/animation-composer-wrapper'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/theme-tokens'|from '@/presentation/components/sections/styling/theme-tokens'|g" {} \;

echo "📁 Updating sections/translations imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/translation-handler'|from '@/presentation/components/sections/translations/translation-handler'|g" {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/sections/utils/variable-substitution'|from '@/presentation/components/sections/translations/variable-substitution'|g" {} \;

# Sections utils - relative imports (from within sections/)
echo "📁 Updating relative imports in sections/..."
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/block-reference-handler'|from './blocks/block-reference-handler'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/block-resolution'|from './blocks/block-resolution'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/props-builder'|from './props/props-builder'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/component-builder'|from './props/component-builder'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/component-registry'|from './rendering/component-registry'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/component-type-dispatcher'|from './rendering/component-type-dispatcher'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/style-processor'|from './styling/style-processor'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/animation-composer-wrapper'|from './styling/animation-composer-wrapper'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/translation-handler'|from './translations/translation-handler'|g" {} \;
find src/presentation/components/sections -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/variable-substitution'|from './translations/variable-substitution'|g" {} \;

# Pages utils - absolute imports
echo "📁 Updating pages imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/pages/utils/|from '@/presentation/components/pages/|g" {} \;

# Pages utils - relative imports
find src/presentation/components/pages -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/|from './|g" {} \;

# Metadata utils - absolute imports
echo "📁 Updating metadata imports..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from '@/presentation/components/metadata/utils/|from '@/presentation/components/metadata/|g" {} \;

# Metadata utils - relative imports
find src/presentation/components/metadata -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|from './utils/|from './|g" {} \;

echo "✅ Import paths updated successfully!"
echo ""
echo "📊 Summary:"
echo "  - Presentation-level: styling, theming, translations, utilities, rendering, scripts"
echo "  - Sections: blocks, props, rendering, styling, translations"
echo "  - Pages: all utils promoted"
echo "  - Metadata: all utils promoted"
