import wikipedia from "wikipedia";
import { Document } from "langchain/document";

export async function getWikipediaDocs(titles: string[]): Promise<Document[]> {
  console.log("Loading wikipedia documents...");

  const docs = [];
  for (const title of titles) {
    console.log(`Loading wikipedia article: ${title}`);
    const document = await loadWikipediaDocument(title);
    docs.push(...document);
  }
  return docs;
}

async function loadWikipediaDocument(title: string) {
  wikipedia.setLang("es");
  const page = await wikipedia.page(title);
  const pageContent = await page.content();

  const titleNames = [
    "Header 1",
    "Header 2",
    "Header 3",
    "Header 4",
    "Header 5",
  ];
  const content = parseWikipediaText(pageContent);
  const metadata = {
    language: "es",
    source: page.fullurl,
    title: page.title,
  };

  return content.map((section) => {
    const sectionMetadata: Record<string, string> = { ...metadata };
    for (let i = 0; i < section.headers.length; i++) {
      const metadataName = titleNames[i];
      const titleValue = section.headers[i];
      if (titleValue) {
        sectionMetadata[metadataName] = titleValue;
      }
    }
    return new Document({
      pageContent: section.content,
      metadata: sectionMetadata,
    });
  });
}

interface Section {
  headers: string[];
  content: string;
}

const titleRegex = /^(=+)\s*(.*?)\s*=+$/;

function parseWikipediaText(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentSection: Section = {
    headers: [],
    content: "",
  };

  for (const line of lines) {
    const titleMatch = line.match(titleRegex);
    if (!titleMatch) {
      currentSection.content += line + "\n";
      continue;
    }

    currentSection.content = currentSection.content.trim();
    sections.push(currentSection);

    const [_, levelMarker, title] = titleMatch;
    const newLevel = levelMarker.length - 2;

    const newHeaders = [...currentSection.headers];
    newHeaders.length = newLevel;
    newHeaders[newLevel] = title;

    currentSection = {
      headers: newHeaders,
      content: "",
    };
  }

  currentSection.content = currentSection.content.trim();
  sections.push(currentSection);
  return sections;
}
