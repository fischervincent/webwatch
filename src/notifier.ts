import type { TrackedItem } from "./types";

export async function notifyChange(
  item: TrackedItem,
  oldValue: string,
  newValue: string
): Promise<void> {
  const ntfyUrl = process.env.NTFY_URL;
  if (!ntfyUrl) {
    console.warn("NTFY_URL not configured, skipping notification");
    return;
  }

  const headers: Record<string, string> = {
    Title: `WebWatch: ${item.name}`,
    Click: item.url,
    "Content-Type": "text/plain",
  };

  const ntfyToken = process.env.NTFY_TOKEN;
  if (ntfyToken) headers["Authorization"] = `Bearer ${ntfyToken}`;

  try {
    const res = await fetch(ntfyUrl, {
      method: "POST",
      headers,
      body: `Was: "${oldValue}"\nNow: "${newValue}"`,
    });
    if (!res.ok) console.error(`ntfy returned ${res.status}`);
  } catch (error) {
    console.error(`Failed to send ntfy notification: ${error}`);
  }
}
