import type { ProbeResult } from "../schema.ts";
import { getJson, pct } from "./http.ts";

const API = "https://optcgapi.com/api";
const SAMPLE = 50;
const DELAY = 500; // "some limits on how much data can be pulled each day", no figure published

type OSet = { set_id: string; set_name: string };
type OCard = { card_name?: string; card_set_id?: string; rarity?: string; card_image?: string; market_price?: number | null };

export async function probeOnepiece(): Promise<ProbeResult> {
  const sets = await getJson<OSet[]>(`${API}/allSets/`, DELAY);

  const bySet = new Map<string, OCard[]>();
  for (const s of sets) bySet.set(s.set_id, await getJson<OCard[]>(`${API}/sets/${s.set_id}/`, DELAY));

  // Listing has no release dates; it is in release order, so take the last set with ≥50 cards.
  const sample = [...sets].reverse().find((s) => bySet.get(s.set_id)!.length >= SAMPLE)!;
  const cards = bySet.get(sample.set_id)!.slice(0, SAMPLE);

  const all = (f: (c: OCard) => unknown) => cards.every((c) => Boolean(f(c)));
  const usd = pct(cards.filter((c) => (c.market_price ?? 0) > 0).length, cards.length);

  const entry: ProbeResult["entry"] = {
    game: "onepiece",
    catalog: {
      source: "optcgapi",
      url: API,
      auth: "none",
      termsUrl: "https://optcgapi.com/about/general",
      termsSummary:
        "Gratis, sin key, sin licencia ni términos formales (\"use it for whatever you want\" informal). El autor obtiene " +
        "catálogo y precios scrapeando la web (cartas activas en TCGplayer EN). Límites diarios no cuantificados.",
      rateLimit: "límite diario no publicado",
      sets: sets.length,
      cards: [...bySet.values()].reduce((n, c) => n + c.length, 0),
      fields: {
        name: all((c) => c.card_name),
        number: all((c) => c.card_set_id),
        rarity: all((c) => c.rarity),
        image: all((c) => c.card_image),
        language: false, // English release only
        finish: false,
      },
      crossIds: { tcgplayer: false, cardmarket: false },
      status: "ok",
      blockedReason: null,
    },
    prices: {
      eur: { source: "optcgapi", url: null, updateFrequency: null, coveragePct: null, status: "ok", blockedReason: "optcgapi no publica precio EUR" },
      usd: { source: "optcgapi (scrape de TCGplayer)", url: API, updateFrequency: "daily", coveragePct: usd, status: "ok", blockedReason: null },
    },
    sampleSet: sample.set_id,
    joinPct: usd,
  };
  return {
    entry,
    sample: cards.map((c) => ({ number: c.card_set_id })),
    tcgGroup: { abbr: sample.set_id.replace("-", "") },
    cardmarketGame: 18,
  };
}
