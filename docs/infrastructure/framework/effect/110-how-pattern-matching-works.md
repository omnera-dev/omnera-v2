## How Pattern Matching Works

Pattern matching follows a structured process:

1. **Creating a matcher**.
   Define a `Matcher` that operates on either a specific [type](#matching-by-type) or [value](#matching-by-value).

2. **Defining patterns**.
   Use combinators such as `Match.when`, `Match.not`, and `Match.tag` to specify matching conditions.

3. **Completing the match**.
   Apply a finalizer such as `Match.exhaustive`, `Match.orElse`, or `Match.option` to determine how unmatched cases should be handled.
