import { Command } from "commander";
import { SerpAPI } from "langchain/tools";

export async function prompt(question: string) {
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "Argentina",
      hl: "es",
      gl: "ar",
    }),
  ];
}

export default new Command("prompt")
  .description("Prompts a question to the AI")
  .arguments("<prompt>")
  .action(prompt);
