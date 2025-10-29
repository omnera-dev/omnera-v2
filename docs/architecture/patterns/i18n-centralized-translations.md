# Internationalization (i18n): Centralized Translations Pattern

## Overview

Omnera™ uses a **hybrid i18n approach** with centralized translations as the PRIMARY pattern and per-component overrides as a fallback. This aligns with industry-standard i18n libraries (i18next, vue-i18n, react-intl, next-intl) and provides better reusability, maintainability, and translator workflow.

## Pattern Comparison

### PRIMARY: Centralized Translations (`$t:` references)

**✅ Recommended for 90% of use cases**

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
- Page content that's reused across sections
- Error messages
- Form labels

### FALLBACK: Per-Component i18n

**⚠️ Use only for truly unique context-specific translations**

```json
{
  "type": "button",
  "i18n": {
    "en-US": { "content": "Submit Tax Return" },
    "fr-FR": { "content": "Soumettre Déclaration Fiscale" }
  }
}
```

**When to use:**
- Translation is truly unique and won't be reused
- Context-specific variation needed (e.g., "Submit Payment" vs generic "Submit")
- Component-specific props need translation (aria-label, placeholder)

## Translation Resolution (Precedence Order)

1. **Per-component i18n** (highest priority)
2. **Centralized `$t:` reference**
3. **Fallback language** (configured in `languages.fallback`)

```json
{
  "languages": {
    "translations": {
      "en-US": { "common.submit": "Submit" },
      "fr-FR": { "common.submit": "Soumettre" }
    }
  },
  "pages": [
    {
      "sections": [
        {
          "type": "button",
          "children": ["$t:common.submit"],
          "i18n": {
            "en-US": { "content": "Submit Payment" }
          }
        }
      ]
    }
  ]
}
```

**Result:** Button displays "Submit Payment" (per-component wins) in English, "Soumettre" (centralized fallback) in French.

## Namespace Organization

Use flat keys with dot notation to organize translations by feature:

### Recommended Namespaces

| Namespace | Purpose | Examples |
|-----------|---------|----------|
| `common.*` | Reusable UI strings across entire app | `common.save`, `common.cancel`, `common.delete` |
| `nav.*` | Navigation menu items | `nav.home`, `nav.about`, `nav.contact` |
| `[page].*` | Page-specific content | `homepage.hero.title`, `about.mission`, `contact.email.label` |
| `errors.*` | Error messages | `errors.404`, `errors.500`, `errors.generic` |
| `forms.*` | Form labels, placeholders, validation | `forms.email.label`, `forms.password.placeholder` |
| `auth.*` | Authentication flows | `auth.login.title`, `auth.signup.cta` |

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
- Use **semantic names** that describe *what*, not *where*
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

### Hybrid: Centralized + Override

```json
{
  "sections": [
    { "type": "button", "children": ["$t:common.submit"] },
    {
      "type": "button",
      "children": ["$t:common.submit"],
      "i18n": {
        "en-US": { "content": "Submit Payment" },
        "fr-FR": { "content": "Soumettre Paiement" }
      }
    }
  ]
}
```

**Renders:**
- Button 1: "Submit" / "Soumettre" (uses centralized)
- Button 2: "Submit Payment" / "Soumettre Paiement" (per-component override)

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

## Migration Guide

### From Per-Component to Centralized

**Before (Per-Component):**
```json
{
  "pages": [
    {
      "sections": [
        {
          "type": "button",
          "i18n": {
            "en-US": { "content": "Save" },
            "fr-FR": { "content": "Enregistrer" }
          }
        },
        {
          "type": "button",
          "i18n": {
            "en-US": { "content": "Save" },
            "fr-FR": { "content": "Enregistrer" }
          }
        }
      ]
    }
  ]
}
```

**After (Centralized):**
```json
{
  "languages": {
    "translations": {
      "en-US": { "common.save": "Save" },
      "fr-FR": { "common.save": "Enregistrer" }
    }
  },
  "pages": [
    {
      "sections": [
        { "type": "button", "children": ["$t:common.save"] },
        { "type": "button", "children": ["$t:common.save"] }
      ]
    }
  ]
}
```

**Benefits:** 2 lines of translation → 1 line, update once affects both.

## Best Practices

### 1. Start Centralized

Always define translations in `languages.translations` first:

```json
{
  "languages": {
    "translations": {
      "en-US": {
        "common.save": "Save",
        "common.cancel": "Cancel",
        "nav.home": "Home"
      }
    }
  }
}
```

Then reference with `$t:key` in components.

### 2. Use Per-Component Sparingly

Only add per-component `i18n` when you need:
- Context-specific variation
- Component-specific prop translation (aria-label)

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
- **Per-Component i18n**: `specs/app/pages/common/i18n.schema.json`
- **Test Examples**: `specs/app/languages/languages.spec.ts`, `specs/app/pages/common/i18n.spec.ts`

## Summary

✅ **Use centralized `$t:` references** for 90% of translations
⚠️ **Use per-component `i18n`** only for context-specific overrides
🌍 **Organize by feature** (common.*, nav.*, [page].*)
📦 **Export/import** one file for translator workflow
🔍 **Audit easily** - all translations in one place

This pattern scales from small apps to large multi-language applications with hundreds of translation keys.
