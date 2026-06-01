import * as cheerio from "cheerio";
import type { TrackedItem } from "./types";

export async function fetchSelectorValue(item: TrackedItem): Promise<string | null> {
  let response: Response;
  try {
    response = await fetch(item.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WebWatch/1.0)" },
    });
  } catch (error) {
    console.error(`Fetch failed for "${item.name}": ${error}`);
    return null;
  }

  if (!response.ok) {
    console.error(`HTTP ${response.status} for "${item.name}" (${item.url})`);
    return null;
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const element = $(item.selector).first();

  if (!element.length) {
    console.warn(`Selector "${item.selector}" not found on ${item.url}`);
    return null;
  }

  switch (item.extract) {
    case "html":
      return element.html() ?? null;
    case "href":
      return element.attr("href") ?? null;
    case "src":
      return element.attr("src") ?? null;
    case "text":
      return element.text().trim() || null;
  }
}
