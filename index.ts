import { z } from "zod";
import { parseWithRetry } from "./parser";

const MovieSchema = z.object({
  title: z.string(),
  year: z.number(),
  rating: z.number().min(0).max(10),
  genres: z.array(z.string()),
});

async function main() {
  const prompt = `
    Give me a movie recommendation in JSON format with the following structure:
    - title (string)
    - year (number)
    - rating (number between 0-10)
    - genres (array of strings)

    Return only the JSON, no other text.

    Here's an example of valid JSON:
    ${JSON.stringify({
      title: "The Dark Knight",
      year: 2008,
      genres: ["Action", "Crime", "Drama"],
    })}
  `;

  try {
    const result = await parseWithRetry({
      schema: MovieSchema,
      prompt,
      maxRetries: 3,
    });

    console.log("Parsed result:", result);
  } catch (error) {
    console.error("Failed after all retries:", error);
  }
}

main();
