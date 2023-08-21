import fs from "fs";
import readline from "readline";
import { getWikipediaDocs } from "./wikipedia";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function getAllDocs() {
  const stream = fs.createReadStream("./data/webscrapping/wikipedia.txt");
  const linesReader = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const titles: string[] = [];
  for await (const line of linesReader) {
    const trimmed = line?.trim();
    if (trimmed && trimmed !== "") {
      titles.push(line);
    }
  }

  const wikipediaDocs = await getWikipediaDocs(titles);
  const splitter = new RecursiveCharacterTextSplitter();

  const splittedDocs = await splitter.splitDocuments(wikipediaDocs);
  return splittedDocs;
}
