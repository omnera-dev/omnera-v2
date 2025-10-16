## Concurrent Access

The cache is designed to be safe for concurrent access and efficient under concurrent conditions. If two concurrent processes request the same value and it is not in the cache, the value will be computed once and provided to both processes as soon as it is available. Concurrent processes will wait for the value without blocking the underlying thread.

If the lookup function fails or is interrupted, the error will be propagated to all concurrent processes waiting for the value. Failures are cached to prevent repeated computation of the same failed value. If interrupted, the key will be removed from the cache, so subsequent calls will attempt to compute the value again.
