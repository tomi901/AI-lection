import { Command } from "commander";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import {
  VectorStoreToolkit,
  createVectorStoreAgent,
  VectorStoreInfo,
} from "langchain/agents";
import { PromptTemplate } from "langchain/prompts";
import { vectorStoreDir } from "./init";

export async function prompt(question: string) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
  });
  console.log("Loading vector store...");
  const vectorStore = await FaissStore.load(vectorStoreDir(), embeddings);

  const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
  });

  const vectorStoreInfo: VectorStoreInfo = {
    name: "elecciones_argentina_2023",
    description: "Las elecciones argentinas 2023 y candidatos a presidente",
    vectorStore,
  };

  const toolkit = new VectorStoreToolkit(vectorStoreInfo, model);
  const agent = createVectorStoreAgent(model, toolkit);

  const prompt = PromptTemplate.fromTemplate<{ question: string }>(
    `Eres un bot asistente que contesta preguntas acerca de las elecciones de Argentina 2023
    y sus candidatos.
    Contesta en Español, de forma imparcial y completa.
    Genera respuestas verbosas y siempre buscando multiples fuentes de información.

    El usuario hace la siguiente consulta: {question}`,
  );
  const input = await prompt.format({
    question,
  });

  console.log("Asking:", question);
  console.log("Formatted as:", input);
  console.log();

  const result = await agent.call({ input });
  console.log(result.output);

  console.log();
  console.log(
    `Got intermediate steps ${JSON.stringify(
      result.intermediateSteps,
      null,
      2,
    )}`,
  );
}

export default new Command("prompt")
  .description("Initializes vector database")
  .arguments("<prompt>")
  .action(prompt);
