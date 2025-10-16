## Effect has a huge performance overhead!

Depends what you mean by performance, many times performance bottlenecks in JS are due to bad management of concurrency.

Thanks to structured concurrency and observability it becomes much easier to spot and optimize those issues.

There are apps in frontend running at 120fps that use Effect intensively, so most likely effect won't be your perf problem.

In regards of memory, it doesn't use much more memory than a normal program would, there are a few more allocations compared to non Effect code but usually this is no longer the case when the non Effect code does the same thing as the Effect code.

The advise would be start using it and monitor your code, optimise out of need not out of thought, optimizing too early is the root of all evils in software design.
