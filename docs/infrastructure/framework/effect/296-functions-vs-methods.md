## Functions vs Methods

The use of functions in the Effect ecosystem libraries is important for
achieving **tree shakeability** and ensuring **extensibility**.
Functions enable efficient bundling by eliminating unused code, and they
provide a flexible and modular approach to extending the libraries'
functionality.

### Tree Shakeability

Tree shakeability refers to the ability of a build system to eliminate unused code during the bundling process. Functions are tree shakeable, while methods are not.

When functions are used in the Effect ecosystem, only the functions that are actually imported and used in your application will be included in the final bundled code. Unused functions are automatically removed, resulting in a smaller bundle size and improved performance.

On the other hand, methods are attached to objects or prototypes, and they cannot be easily tree shaken. Even if you only use a subset of methods, all methods associated with an object or prototype will be included in the bundle, leading to unnecessary code bloat.

### Extensibility

Another important advantage of using functions in the Effect ecosystem is the ease of extensibility. With methods, extending the functionality of an existing API often requires modifying the prototype of the object, which can be complex and error-prone.

In contrast, with functions, extending the functionality is much simpler. You can define your own "extension methods" as plain old functions without the need to modify the prototypes of objects. This promotes cleaner and more modular code, and it also allows for better compatibility with other libraries and modules.
