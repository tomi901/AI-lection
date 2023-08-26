import { getAllDocs } from "@/docs-source/index.js";
import { Command } from "commander";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import os from "os";
import path from "path";

export function vectorStoreDir() {
  return path.join("./db", "ailection-data");
}

export async function init() {
  console.log("Loading all docs...");
  const docs = await getAllDocs();

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
  });
  console.log("Initializing vector store...");
  const vectorStore = await FaissStore.fromDocuments(docs, embeddings);

  console.log("Saving vector store...");
  await vectorStore.save(vectorStoreDir());

  console.log("Done!");
}

export default new Command("init")
  .description("Initializes vector database")
  .action(init);
