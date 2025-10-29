# Internationalization (i18n): Centralized Translations Pattern

## Overview

> **⚠️ BREAKING CHANGE NOTICE (v0.2.0)**
>
> Per-component `i18n` overrides are **DEPRECATED** and will be removed in v0.2.0. This documentation now reflects the pure centralized pattern that aligns with industry standards (i18next, vue-i18n, react-intl, next-intl).

Omnera™ uses a **pure centralized i18n approach** with all translations defined in `languages.translations`. This provides better reusability, maintainability, and translator workflow by maintaining a single source of truth for all translations.

## The Centralized Pattern

### How It Works

**✅ The ONLY supported pattern (per-component i18n deprecated)**

```json
{
  "languages": {
    "translations": {
      "en-US": {
        "common.save": "Save",
        "common.cancel": "Cancel",
        "nav.home": "Home",
        "homepage.hero.title": "Welcome to Omnera"
      },
      "fr-FR": {
        "common.save": "Enregistrer",
        "common.cancel": "Annuler",
        "nav.home": "Accueil",
        "homepage.hero.title": "Bienvenue sur Omnera"
      }
    }
  },
  "pages": [
    {
      "sections": [
        { "type": "h1", "children": ["$t:homepage.hero.title"] },
        { "type": "button", "children": ["$t:common.save"] }
      ]
    }
  ]
}
```

**Benefits:**

- ✅ **Single source of truth** - All translations in one place
- ✅ **Reusability** - `$t:common.save` used everywhere
- ✅ **Translator-friendly** - Export one file, translate, import back
- ✅ **Organized namespaces** - `common.*`, `nav.*`, `homepage.*`
- ✅ **Easy auditing** - Find missing/unused translations instantly
- ✅ **Industry standard** - Same pattern as major i18n libraries

**Use cases:**

- Common UI strings (Save, Cancel, Submit, etc.)
- Navigation items
- Page content (all content, including context-specific variations)
- Error messages
- Form labels
- All text content in the application

**For context-specific variations**, use more specific translation keys:
- ❌ Bad: `common.submit` with per-component override for "Submit Payment"
- ✅ Good: Create `payment.submit` key with value "Submit Payment"

## Namespace Organization

Use flat keys with dot notation to organize translations by feature:

### Recommended Namespaces

| Namespace  | Purpose                               | Examples                                                      |
| ---------- | ------------------------------------- | ------------------------------------------------------------- |
| `common.*` | Reusable UI strings across entire app | `common.save`, `common.cancel`, `common.delete`               |
| `nav.*`    | Navigation menu items                 | `nav.home`, `nav.about`, `nav.contact`                        |
| `[page].*` | Page-specific content                 | `homepage.hero.title`, `about.mission`, `contact.email.label` |
| `errors.*` | Error messages                        | `errors.404`, `errors.500`, `errors.generic`                  |
| `forms.*`  | Form labels, placeholders, validation | `forms.email.label`, `forms.password.placeholder`             |
| `auth.*`   | Authentication flows                  | `auth.login.title`, `auth.signup.cta`                         |

### Naming Conventions

**✅ Good (Semantic):**

```json
{
  "common.save": "Save",
  "homepage.hero.cta": "Get Started",
  "nav.about": "About Us"
}
```

**❌ Bad (Positional/Technical):**

```json
{
  "button1": "Save",
  "section1.text1": "Get Started",
  "link_2": "About Us"
}
```

**Key Principles:**

- Use **semantic names** that describe _what_, not _where_
- Include **feature context** (homepage, auth, nav)
- Avoid **component types** in keys (button, div, span)
- Avoid **positional names** (button1, text2)

## Usage Examples

### Basic Translation Reference

```json
{
  "type": "button",
  "children": ["$t:common.save"]
}
```

**Renders:** "Save" (en-US), "Enregistrer" (fr-FR)

### Multiple Components Sharing Translation

```json
{
  "sections": [
    { "type": "button", "children": ["$t:common.save"] },
    { "type": "a", "children": ["$t:common.save"] },
    { "type": "span", "children": ["$t:common.save"] }
  ]
}
```

**Benefit:** Change translation once, updates everywhere.

### Context-Specific Variations

For context-specific text, use more specific translation keys instead of overrides:

```json
{
  "languages": {
    "translations": {
      "en-US": {
        "common.submit": "Submit",
        "payment.submit": "Submit Payment",
        "form.submit": "Submit Form"
      },
      "fr-FR": {
        "common.submit": "Soumettre",
        "payment.submit": "Soumettre Paiement",
        "form.submit": "Soumettre Formulaire"
      }
    }
  },
  "sections": [
    { "type": "button", "children": ["$t:common.submit"] },
    { "type": "button", "children": ["$t:payment.submit"] },
    { "type": "button", "children": ["$t:form.submit"] }
  ]
}
```

**Renders:**

- Button 1: "Submit" / "Soumettre"
- Button 2: "Submit Payment" / "Soumettre Paiement"
- Button 3: "Submit Form" / "Soumettre Formulaire"

**Benefits:**
- All translations in one place
- Easy to audit and update
- Translator sees all variations together
- No precedence rules to remember

### Fallback Behavior

```json
{
  "languages": {
    "default": "en-US",
    "fallback": "en-US",
    "translations": {
      "en-US": {
        "common.save": "Save",
        "common.cancel": "Cancel"
      },
      "fr-FR": {
        "common.save": "Enregistrer"
        // "common.cancel" missing - will fall back to English
      }
    }
  }
}
```

**Result:** French page shows "Enregistrer" (French) and "Cancel" (English fallback).

## Migration Guide (v0.1.x → v0.2.0)

> **Migration Timeline:**
> - v0.1.1: Per-component `i18n` property marked as deprecated (warnings emitted)
> - v0.2.0: Per-component `i18n` property removed entirely (breaking change)

### Automated Migration

Use the automated migration script to convert per-component translations to centralized:

```bash
bun run scripts/migrate-i18n-to-centralized.ts
```

This script will:
1. Extract all per-component `i18n` translations
2. Generate centralized translation keys
3. Replace per-component i18n with `$t:` references
4. Update `languages.translations` dictionary

### Manual Migration Steps

If migrating manually, follow these steps:

**Step 1: Identify all per-component translations**

```bash
# Find all components using per-component i18n
grep -r '"i18n"' specs/app/pages/ specs/app/blocks/
```

**Step 2: Extract translations to centralized dictionary**

```json
{
  "languages": {
    "translations": {
      "en-US": {
        "common.save": "Save",
        "common.cancel": "Cancel"
      },
      "fr-FR": {
        "common.save": "Enregistrer",
        "common.cancel": "Annuler"
      }
    }
  }
}
```

**Step 3: Replace per-component i18n with $t: references**

```json
// Before
{
  "type": "button",
  "i18n": {
    "en-US": { "content": "Save" },
    "fr-FR": { "content": "Enregistrer" }
  }
}

// After
{
  "type": "button",
  "children": ["$t:common.save"]
}
```

**Benefits:** Eliminates duplication, single source of truth, easier maintenance.

## Best Practices

### 1. Always Use Centralized Translations

Define ALL translations in `languages.translations`:

```json
{
  "languages": {
    "translations": {
      "en-US": {
        "common.save": "Save",
        "common.cancel": "Cancel",
        "nav.home": "Home",
        "payment.submit": "Submit Payment"
      }
    }
  }
}
```

Then reference with `$t:key` in ALL components - no exceptions.

### 2. Use Specific Keys for Context-Specific Text

Instead of generic keys with overrides, create specific keys:

- ✅ Good: `payment.submit`, `form.submit`, `order.submit`
- ❌ Bad: `common.submit` (reused with different meanings)

### 3. Organize by Feature, Not Component

✅ Good: `homepage.hero.title`, `about.team.subtitle`
❌ Bad: `h1.text1`, `div.content`

### 4. Keep Keys Consistent

Use a consistent prefix structure:

- `common.*` - Reusable
- `nav.*` - Navigation
- `[page].*` - Page-specific
- `errors.*` - Errors
- `forms.*` - Forms

### 5. Document Missing Translations

When a translation key is missing in a language, it falls back to the default language. This is intentional - you can:

- Deploy with partial translations
- Add translations incrementally
- See which keys need translation (audit centralized file)

## Translator Workflow

### Export Translations

```bash
# Extract translations for translators
cat specs/app/languages/languages.schema.json | jq '.examples[2].translations["en-US"]' > en-US.json
```

### Translate

Translator receives `en-US.json`:

```json
{
  "common.save": "Save",
  "common.cancel": "Cancel",
  "homepage.hero.title": "Welcome to Omnera"
}
```

Returns `fr-FR.json`:

```json
{
  "common.save": "Enregistrer",
  "common.cancel": "Annuler",
  "homepage.hero.title": "Bienvenue sur Omnera"
}
```

### Import Translations

```bash
# Merge translations back into schema
# Update languages.translations["fr-FR"] with fr-FR.json
```

## Schema Structure

### Languages Configuration

```json
{
  "languages": {
    "default": "en-US",
    "fallback": "en-US",
    "detectBrowser": true,
    "persistSelection": true,
    "supported": [
      { "code": "en-US", "label": "English", "direction": "ltr" },
      { "code": "fr-FR", "label": "Français", "direction": "ltr" }
    ],
    "translations": {
      "[language-code]": {
        "[key]": "[translation]"
      }
    }
  }
}
```

**Properties:**

- `translations`: Centralized translation dictionaries (flat keys with dot notation)
- `default`: Default language code (required)
- `fallback`: Fallback when translation missing (optional, defaults to `default`)
- `supported`: Array of supported languages (required)
- `detectBrowser`: Auto-detect browser language (optional, default: true)
- `persistSelection`: Remember user's language choice (optional, default: true)

### Translation Key Pattern

Keys must match: `^[a-zA-Z0-9._-]+$`

**Valid:**

- `common.save`
- `homepage.hero.title`
- `nav_home` (underscore allowed)
- `errors.404`

**Invalid:**

- `common save` (no spaces)
- `common:save` (no colons)
- `common/save` (no slashes)

## Related Documentation

- **Language Configuration**: `specs/app/languages/languages.schema.json`
- **Per-Component i18n (DEPRECATED)**: `specs/app/pages/common/i18n.schema.json`
- **Test Examples**: `specs/app/languages/languages.spec.ts`, `specs/app/pages/common/i18n.spec.ts`
- **Migration Script**: `scripts/migrate-i18n-to-centralized.ts` (coming in v0.1.1)

## Summary

✅ **Use centralized `$t:` references** for ALL translations (100%)
🚫 **Per-component `i18n` is deprecated** and will be removed in v0.2.0
🌍 **Organize by feature** (common._, nav._, [page]._)
📦 **Export/import** one file for translator workflow
🔍 **Audit easily** - all translations in one place
🎯 **Context-specific text** - Use specific keys, not overrides

This pattern aligns with industry standards (i18next, vue-i18n, react-intl, next-intl) and scales from small apps to large multi-language applications with thousands of translation keys.
