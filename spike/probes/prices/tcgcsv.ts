import type { ProbeResult } from "../../schema.ts";
import { getJson, pct } from "../http.ts";

const API = "https://tcgcsv.com/tcgplayer";
export const TCGCSV_URL = API;
const DELAY = 250; // FAQ example pauses 0.25 s
const CATEGORY: Record<string, number> = { mtg: 1, yugioh: 2, pokemon: 3, onepiece: 68, lorcana: 71, riftbound: 89 };

type Group = { groupId: number; abbreviation: string | null; name: string };
type Product = { productId: number; extendedData: { name: string; value: string }[] };
type Price = { productId: number; marketPrice: number | null; midPrice: number | null };

/** % of sample printings with a TCGplayer USD price, joined by productId or by collector number (+ rarity) unique in the set's group. */
export async function tcgcsvCoverage(p: ProbeResult): Promise<{ coveragePct: number | null; reason: string | null }> {
  const cat = CATEGORY[p.entry.game];
  const groups = (await getJson<{ results: Group[] }>(`${API}/${cat}/groups`, DELAY)).results;
  const g = p.tcgGroup;
  const group =
    groups.find((x) => x.groupId === g.id) ??
    groups.find((x) => g.abbr && x.abbreviation?.toUpperCase() === g.abbr.toUpperCase()) ??
    groups.find((x) => g.name && x.name.toLowerCase().endsWith(g.name.toLowerCase()));
  if (!group) return { coveragePct: null, reason: `tcgcsv: ningún grupo coincide con ${JSON.stringify(g)}` };

  const products = (await getJson<{ results: Product[] }>(`${API}/${cat}/${group.groupId}/products`, DELAY)).results;
  const prices = (await getJson<{ results: Price[] }>(`${API}/${cat}/${group.groupId}/prices`, DELAY)).results;
  const priced = new Set(prices.filter((x) => (x.marketPrice ?? x.midPrice ?? 0) > 0).map((x) => x.productId));

  const ext = (pr: Product, name: string) => pr.extendedData.find((e) => e.name === name)?.value;
  const byNumber = new Map<string, Product[]>();
  for (const pr of products) {
    const n = ext(pr, "Number");
    if (n) byNumber.set(n, [...(byNumber.get(n) ?? []), pr]);
  }

  const joined = p.sample.filter((s) => {
    if (s.tcgplayer) return priced.has(s.tcgplayer);
    let candidates = (s.number && byNumber.get(s.number)) || [];
    if (candidates.length > 1 && s.rarity) candidates = candidates.filter((pr) => ext(pr, "Rarity")?.toLowerCase() === s.rarity!.toLowerCase());
    return candidates.length === 1 && priced.has(candidates[0].productId); // still ambiguous = needs manual pick
  });
  return { coveragePct: pct(joined.length, p.sample.length), reason: null };
}
