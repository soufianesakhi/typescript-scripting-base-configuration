import fs from "node:fs/promises";

import path from "node:path";

import { fileURLToPath } from "url";

// Path to the current script
const __filename = fileURLToPath(import.meta.url);

// Path to the current directory
const __dirname = path.dirname(__filename);

const articlesPath = path.join(__dirname, "..", ".data", "articles.json");
const articles: ArticleDTO[] = JSON.parse(
  await fs.readFile(articlesPath, "utf-8")
);

const exportedArticles = articles
  .map((article) => {
    return {
      title: article.title,
      modifiedDate: new Date(
        article.contentUpdateDate ?? article.publishDate ?? ""
      ),
    };
  })
  .sort((articleA, articleB) => {
    return articleB.modifiedDate.getTime() - articleA.modifiedDate.getTime();
  })
  .reduce((articles, article) => {
    articles[article.title] = article.modifiedDate.toISOString();
    return articles;
  }, {} as Record<string, string>);

const outputPath = path.join(
  __dirname,
  "..",
  "dist",
  "exported-articles-sorted-by-modified-date-desc.json"
);
fs.writeFile(outputPath, JSON.stringify(exportedArticles, null, 2));
