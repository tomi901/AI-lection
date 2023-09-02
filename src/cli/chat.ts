import { Command } from "commander";
import readline from "readline";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { SerpAPI, WikipediaQueryRun } from "langchain/tools";

const PREFIX_TEMPLATE = `You're an AI that helps giving information about the Argentine 2023 Elections and their candidates.

Answer in spanish and only in spanish, be impartial and search multiple sources.
If you don't know the answer just tell you don't know.
ALWAYS search information on the internet or your available resources, assume that you don't know the answer from the start.

The main candidates with their respective parties are:
- Javier Milei - La libertad avanza
- Patricia Bullrich - Juntos por el cambio
- Sergio Massa - Union por la patria`;

export async function runChat() {
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "Argentina",
      hl: "es",
      gl: "ar",
    }),
  ];

  const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });

  const executor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: "openai-functions",
    returnIntermediateSteps: true,
    memory: new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
      outputKey: "output",
    }),
    agentArgs: {
      prefix: PREFIX_TEMPLATE,
    },
  });

  const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const message = await new Promise<string>((res) => cli.question("> ", res));
    if (!message || message === "") {
      break;
    }

    const result = await executor.call({
      input: message,
    });

    console.log(JSON.stringify(result.intermediateSteps, null, 2));
    console.log(result.output);
  }

  cli.close();
}

export default new Command("chat")
  .description("Starts a chat with the AI")
  .action(runChat);
