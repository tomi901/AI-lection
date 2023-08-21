import { TextSplitter } from "langchain/text_splitter";
import wikipedia from "wikipedia";
import { Document } from "langchain/document";

export async function getWikipediaDocs(titles: string[]) {
  console.log("Loading wikipedia documents...");

  const docs = [];
  for (const title of titles) {
    console.log(`Loading wikipedia article: ${title}`);
    const document = await loadWikipediaDocument(title);
    docs.push(document);
  }
  return docs;
}

async function loadWikipediaDocument(title: string) {
  wikipedia.setLang("es");
  const page = await wikipedia.page(title);
  const pageContent = await page.content();

  console.log(pageContent);

  return new Document({
    pageContent,
    metadata: {
      source: page.fullurl,
      title: page.title,
    },
  });
}

interface Section {
  title: string;
  content: string;
  subsections: Section[];
}

const titleRegex = /^(=+)\s*(.*?)\s*=+$/;

function parseWikipediaText(text: string, currentDepth = 0): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let sectionStack: Section[] = [];

  for (const line of lines) {
  }

  return [];
}
