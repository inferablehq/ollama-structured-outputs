import { z } from "zod";
import retry from "async-retry";

interface ParserOptions {
  maxRetries?: number;
  schema: z.ZodSchema;
  prompt: string;
}

async function callOllama(prompt: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}

export async function parseWithRetry({
  maxRetries = 3,
  schema,
  prompt,
}: ParserOptions) {
  return retry(
    async (bail, attempt) => {
      try {
        // If this isn't the first attempt, add the previous error to the prompt
        const fullPrompt =
          attempt === 1
            ? prompt
            : `${prompt}\n\nPrevious attempt failed with error: ${attempt}. Please fix and try again.`;

        const response = await callOllama(fullPrompt);

        // Extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return schema.parse(parsed);
      } catch (error) {
        if (attempt === maxRetries) {
          bail(error as Error);
          return;
        }
        throw error;
      }
    },
    {
      retries: maxRetries,
      factor: 1,
      minTimeout: 100,
      maxTimeout: 1000,
    }
  );
}
