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

export async function search(query: string) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
  });
  console.log("Loading vector store...");
  const vectorStore = await FaissStore.load(vectorStoreDir(), embeddings);

  const result = await vectorStore.similaritySearch(query);
  console.log(result);
}

export default new Command("vector-search")
  .description("Searchs in the vector db the given info")
  .arguments("<prompt>")
  .action(search);
