## Built-in Implementations

The module includes two built-in implementations of the `KeyValueStore` interface. Both are provided as [layers](/docs/requirements-management/layers/) that you can inject into your effectful programs.

| Implementation        | Description                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| **In-Memory Store**   | `layerMemory` provides a simple, in-memory key-value store, ideal for lightweight or testing scenarios. |
| **File System Store** | `layerFileSystem` offers a file-based store for persistent storage needs.                               |
