export type Phrase = {
  word: string;
  meaning: string;
  partOfSpeech: string[];
  example: string;
  exampleTranslation: string;
};

type NotionRichText = {
  plain_text: string;
};

type NotionMultiSelectOption = {
  name: string;
};

type NotionPage = {
  properties: {
    単語: { type: "title"; title: NotionRichText[] };
    意味: { type: "rich_text"; rich_text: NotionRichText[] };
    品詞: { type: "multi_select"; multi_select: NotionMultiSelectOption[] };
    例文: { type: "rich_text"; rich_text: NotionRichText[] };
    例文訳: { type: "rich_text"; rich_text: NotionRichText[] };
  };
};

function getRichText(items: NotionRichText[]): string {
  return items.map((item) => item.plain_text).join("");
}

export function parseNotionResults(results: unknown[]): Phrase[] {
  return (results as NotionPage[])
    .map((page) => ({
      word: getRichText(page.properties.単語.title),
      meaning: getRichText(page.properties.意味.rich_text),
      partOfSpeech: page.properties.品詞.multi_select.map((o) => o.name),
      example: getRichText(page.properties.例文.rich_text),
      exampleTranslation: getRichText(page.properties.例文訳.rich_text),
    }))
    .filter((phrase) => phrase.word.length > 0);
}

export function pickRandom(phrases: Phrase[]): Phrase {
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index]!;
}
