# TypeScript Parser Project

A TypeScript-based parser implementation that uses Zod for schema validation with retries to force an LLM to return a structured output. Uses Ollama as the LLM provider with llama3.2. This is a companion project to the [Adding structured outputs as a feature to any LLM](https://inferable.ai/blog/structured-outputs-with-llms) blog post.

## Prerequisites

- Node.js and npm installed
- Ollama running locally with the llama3.2 model

## Setup

1. Install dependencies:

## Usage

```bash
tsx index.ts
```

This should return a JSON object with a movie recommendation.

```json
{
  "title": "The Shawshank Redemption",
  "year": 1994,
  "rating": 9,
  "genres": ["Drama", "Thriller"]
}
```

## License

This project is licensed under the MIT License.
