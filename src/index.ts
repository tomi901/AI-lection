import { RetrievalQAChain } from 'langchain/chains';
import dotenv from "dotenv";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";

async function main() {
  dotenv.config();

  // Create docs with a loader
  const loader = new TextLoader("./data/PLATAFORMA LA LIBERTAD AVANZA.txt");
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splittedDocs = await splitter.splitDocuments(docs);

  // Load the docs into the vector store
  const vectorStore = await FaissStore.fromDocuments(
    splittedDocs,
    new OpenAIEmbeddings(),
  );

  const vectorStoreRetriever = vectorStore.asRetriever();

  // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
  const model = new OpenAI({});
  const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
  const res = await chain.call({
    query:
      "¿Diría que Milei va a conservar la salud pública y mejorarla en calidad?",
  });
  console.log({ res });
}

main();
