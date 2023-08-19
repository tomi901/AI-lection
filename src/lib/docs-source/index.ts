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

  const links: string[] = [];
  for await (const line of linesReader) {
    if (line && !line.match(/^ *$/)) {
      links.push(line);
    }
  }

  const splitter = new RecursiveCharacterTextSplitter();

  const wikipediaDocs = await getWikipediaDocs({
    links,
    splitter,
  });
  return wikipediaDocs;
}
