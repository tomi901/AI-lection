import { Command } from "commander";
import { RetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { vectorStoreDir } from "./init.js";

export async function prompt() {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
  });
  console.log("Loading vector store...");
  const vectorStore = await FaissStore.load(vectorStoreDir(), embeddings);

  const vectorStoreRetriever = vectorStore.asRetriever();

  const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
  });
  const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever, {
    verbose: true,
  });
  console.log("Waiting for answer...");
  const res = await chain.call({
    query: "Resume cual es la ideología de Patricia Bullrich",
  });
  console.log({ res });
}

export default new Command("prompt")
  .description("Initializes vector database")
  .action(prompt);
