## Spans

A **span** represents a single unit of work or operation within a request. It provides a detailed view of what happened during the execution of that specific operation.

Each span typically contains the following information:

| Span Component   | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| **Name**         | Describes the specific operation being tracked.                    |
| **Timing Data**  | Timestamps indicating when the operation started and its duration. |
| **Log Messages** | Structured logs capturing important events during the operation.   |
| **Attributes**   | Metadata providing additional context about the operation.         |

Spans are key building blocks in tracing, helping you visualize and understand the flow of requests through various services.
