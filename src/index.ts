import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import dotenv from "dotenv";

async function main() {
  dotenv.config();

  const text = fs.readFileSync(
    "./data/PLATAFORMA LA LIBERTAD AVANZA.txt",
    "utf8",
  );
  console.log(`Loaded text with ${text.length} characters`);
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  // Create a vector store from the documents.
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

  // Initialize a retriever wrapper around the vector store
  const vectorStoreRetriever = vectorStore.asRetriever();

  // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
  const model = new OpenAI({});
  const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
  const res = await chain.call({
    query:
      "Resumiendo, ¿Cuáles son las propuestas de Milei respecto a la salud?",
  });
  console.log({ res });
}

main();
