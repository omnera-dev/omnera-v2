# Language Middleware

The Language Detector middleware automatically determines a user's preferred language (locale) from various sources and makes it available via `c.get('language')`. Detection strategies include query parameters, cookies, headers, and URL path segments. Perfect for internationalization (i18n) and locale-specific content.

## Import

```ts
import { Hono } from 'hono'
import { languageDetector } from 'hono/language'
```

## Basic Usage

Detect language from query string, cookie, and header (default order), with fallback to English:

```ts
const app = new Hono()

app.use(
  languageDetector({
    supportedLanguages: ['en', 'ar', 'ja'], // Must include fallback
    fallbackLanguage: 'en', // Required
  })
)

app.get('/', (c) => {
  const lang = c.get('language')
  return c.text(`Hello! Your language is ${lang}`)
})
```

### Client Examples

```sh

```
