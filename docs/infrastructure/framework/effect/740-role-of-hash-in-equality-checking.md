## Role of Hash in Equality Checking

The primary purpose of the `Hash` interface is to provide a quick and efficient way to determine if two values are definitely not equal, thereby complementing the [Equal](/docs/trait/equal/) interface. When two values implement the [Equal](/docs/trait/equal/) interface, their hash values (computed using the `Hash` interface) are compared first:

- **Different Hash Values**: If the hash values are different, it is guaranteed that the values themselves are different. This quick check allows the system to avoid a potentially expensive equality check.
- **Same Hash Values**: If the hash values are the same, it does not guarantee that the values are equal, only that they might be. In this case, a more thorough comparison using the [Equal](/docs/trait/equal/) interface is performed to determine actual equality.

This method dramatically speeds up the equality checking process, especially in collections where quick look-up and insertion times are crucial, such as in hash sets or hash maps.
