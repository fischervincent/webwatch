export interface TrackedItem {
  id: string;
  name: string;
  url: string;
  selector: string;
  extract: "text" | "html" | "href" | "src";
  last_value: string | null;
  last_checked: string | null;
  created_at: string;
  enabled: boolean;
}
