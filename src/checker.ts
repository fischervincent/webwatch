import { readFileSync, writeFileSync } from "node:fs";
import type { TrackedItem } from "./types";
import { fetchSelectorValue } from "./fetcher";
import { notifyChange } from "./notifier";

const DATA_PATH = "data/items.json";

async function run(): Promise<void> {
  const items: TrackedItem[] = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

  for (const item of items) {
    if (!item.enabled) {
      console.log(`[${item.name}] Skipped (disabled)`);
      continue;
    }

    const currentValue = await fetchSelectorValue(item);
    const now = new Date().toISOString();

    if (currentValue === null) {
      item.last_checked = now;
      continue;
    }

    if (item.last_value === null) {
      console.log(`[${item.name}] Baseline recorded: "${currentValue}"`);
      item.last_value = currentValue;
    } else if (currentValue !== item.last_value) {
      console.log(`[${item.name}] Changed: "${item.last_value}" → "${currentValue}"`);
      await notifyChange(item, item.last_value, currentValue);
      item.last_value = currentValue;
    } else {
      console.log(`[${item.name}] No change: "${currentValue}"`);
    }

    item.last_checked = now;
  }

  writeFileSync(DATA_PATH, JSON.stringify(items, null, 2) + "\n");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
