## Effect heavily relies on generators and generators are slow!

Effect's internals are not built on generators, we only use generators to provide an API which closely mimics async-await. Internally async-await uses the same mechanics as generators and they are equally performant. So if you don't have a problem with async-await you won't have a problem with Effect's generators.

Where generators and iterables are unacceptably slow is in transforming collections of data, for that try to use plain arrays as much as possible.
