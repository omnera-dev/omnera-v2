## Overview

Language models are great at generating text, but often we need them to take **real-world actions**, such as querying an API, accessing a database, or calling a service. Most LLM providers support this through **tool use** (also known as *function calling*), where you expose specific operations in your application that the model can invoke.

Based on the input it receives, a model may choose to **invoke (or call)** one or more tools to augment its response. Your application then runs the corresponding logic for the tool using the parameters provided by the model. You then return the result to the model, allowing it to include the output in its final response.

The `Toolkit` simplifies tool integration by offering a structured, type-safe approach to defining tools. It takes care of all the wiring between the model and your application - all you have to do is define the tool and implement its behavior.
