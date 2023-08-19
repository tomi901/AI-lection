import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { TextSplitter } from "langchain/text_splitter.js";

export async function getWikipediaDocs(params: {
  links: string[];
  splitter: TextSplitter;
}) {
  const loaders = params.links.map(
    (link) => new CheerioWebBaseLoader(link, { selector: "#bodyContent" }),
  );

  const docs = await Promise.all(
    loaders.map((loader) => loader.loadAndSplit(params.splitter)),
  );
  return docs.flat();
}
