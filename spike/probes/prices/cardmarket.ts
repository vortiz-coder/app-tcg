import type { ProbeResult } from "../../schema.ts";
import { getJson, pct } from "../http.ts";

const BASE = "https://downloads.s3.cardmarket.com/productCatalog";
export const CARDMARKET_URL = BASE;

type Guide = { idProduct: number } & Record<string, number | null>;
type Product = { idProduct: number; name: string };

/** % of sample printings with a Cardmarket EUR price, joined by idProduct or by unique "(NUMBER)" in the product name. */
export async function cardmarketCoverage(p: ProbeResult): Promise<{ coveragePct: number | null; reason: string | null }> {
  const g = p.cardmarketGame;
  const guides = (await getJson<{ priceGuides: Guide[] }>(`${BASE}/priceGuide/price_guide_${g}.json`, 250)).priceGuides;
  const priced = new Set(
    guides.filter((x) => ["trend", "avg", "trend-foil", "avg-foil"].some((k) => (x[k] ?? 0) > 0)).map((x) => x.idProduct),
  );

  if (p.sample.some((s) => s.cardmarket)) {
    return { coveragePct: pct(p.sample.filter((s) => s.cardmarket && priced.has(s.cardmarket)).length, p.sample.length), reason: null };
  }
  if (!p.sample.some((s) => s.number)) {
    return { coveragePct: null, reason: "cardmarket: el catálogo no da idProduct ni número para asociar" };
  }

  const products = (await getJson<{ products: Product[] }>(`${BASE}/productList/products_singles_${g}.json`, 250)).products;
  const byNumber = new Map<string, number[]>();
  for (const pr of products) {
    const n = pr.name.match(/\(([A-Z0-9]+-[A-Z0-9]+)\)\s*$/)?.[1];
    if (n) byNumber.set(n, [...(byNumber.get(n) ?? []), pr.idProduct]);
  }
  const joined = p.sample.filter((s) => {
    const ids = s.number ? byNumber.get(s.number) : undefined;
    return ids?.length === 1 && priced.has(ids[0]);
  });
  const count = (f: (n: number) => boolean) => p.sample.filter((s) => f(byNumber.get(s.number ?? "")?.length ?? 0)).length;
  const [missing, ambiguous] = [count((n) => n === 0), count((n) => n > 1)];
  const reason =
    [
      missing && `${missing}/${p.sample.length} sin número en el nombre de producto`,
      ambiguous && `${ambiguous}/${p.sample.length} números con varios productos (versiones), requiere elección manual`,
    ].filter(Boolean).map((r) => `cardmarket: ${r}`).join("; ") || null;
  return { coveragePct: pct(joined.length, p.sample.length), reason };
}
