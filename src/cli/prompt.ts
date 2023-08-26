import { Command } from "commander";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  VectorStoreToolkit,
  createVectorStoreAgent,
  VectorStoreInfo,
} from "langchain/agents";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { vectorStoreDir } from "./init";
import {
  ConversationChain,
  ConversationalRetrievalQAChain,
  RetrievalQAChain,
  VectorDBQAChain,
} from "langchain/chains";
import {
  createConversationalRetrievalAgent,
  createRetrieverTool,
} from "langchain/agents/toolkits";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { SerpAPI, ChainTool } from "langchain/tools";
import { BufferMemory } from "langchain/memory";

const systemInitialMessage = `Eres un bot asistente que contesta preguntas acerca de las elecciones de Argentina 2023 y sus candidatos.
Contesta en Español, de forma imparcial y completa. Si no hay suficiente información, contesta que no tienes información y que no puedes contestar.`;

export async function prompt(question: string) {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
  });

  const embeddings = new OpenAIEmbeddings();
  console.log("Loading vector store...");
  const vectorStore = await FaissStore.load(vectorStoreDir(), embeddings);
  const qaChain = VectorDBQAChain.fromLLM(model, vectorStore);

  const documentsTool = new ChainTool({
    chain: qaChain,
    name: "elecciones_2023_documents",
    description:
      "Searches and returns documents regarding the Argentina 2023 Elections and their candidates (Presidents mainly). Use as a first resource.",
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      returnSourceDocuments: true,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        inputKey: "question",
        outputKey: "text",
        returnMessages: true,
      }),
      questionGeneratorChainOptions: {
        llm: model,
      },
    },
  );

  console.log("Asking:", question);
  console.log();

  const result = await chain.call({ question });
  console.log(result);

  /*
  console.log();
  console.log(
    `Got intermediate steps ${JSON.stringify(
      result.intermediateSteps,
      null,
      2,
    )}`,
  );
  */
}

export default new Command("prompt")
  .description("Prompts a question to the AI")
  .arguments("<prompt>")
  .action(prompt);
