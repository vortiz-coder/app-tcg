import type { ProbeResult } from "../schema.ts";
import { getJson, pct } from "./http.ts";

const API = "https://api.lorcast.com/v0";
const SAMPLE = 50;
const DELAY = 100; // docs: 50–100 ms between requests

type LSet = { code: string; name: string; released_at?: string };
type LCard = {
  name?: string; collector_number?: string; rarity?: string; lang?: string;
  image_uris?: object; tcgplayer_id?: number; prices?: Record<string, string | null>;
};

export async function probeLorcana(): Promise<ProbeResult> {
  const sets = (await getJson<{ results: LSet[] }>(`${API}/sets`, DELAY)).results;
  const today = new Date().toISOString().slice(0, 10);

  // No card count in the listing: fetch every set's cards to count them.
  const bySet = new Map<string, LCard[]>();
  for (const s of sets) bySet.set(s.code, await getJson<LCard[]>(`${API}/sets/${s.code}/cards`, DELAY));

  const sample = sets
    .filter((s) => s.released_at && s.released_at <= today && bySet.get(s.code)!.length >= SAMPLE)
    .sort((a, b) => b.released_at!.localeCompare(a.released_at!))[0];
  const cards = bySet.get(sample.code)!.slice(0, SAMPLE);

  const all = (f: (c: LCard) => unknown) => cards.every((c) => Boolean(f(c)));
  const usd = pct(cards.filter((c) => c.prices?.usd != null || c.prices?.usd_foil != null).length, cards.length);

  const entry: ProbeResult["entry"] = {
    game: "lorcana",
    catalog: {
      source: "lorcast",
      url: API,
      auth: "none",
      termsUrl: "https://lorcast.com/docs/api",
      termsSummary:
        "API gratuita sin key; prohíbe cobrar por acceder a su contenido; anima a cachear ≥24h. Contenido bajo Community " +
        "Code Policy de Ravensburger, sin endorsement de Disney/Ravensburger.",
      rateLimit: "50–100 ms entre requests (~10 req/s); *.lorcast.io sin límite",
      sets: sets.length,
      cards: [...bySet.values()].reduce((n, c) => n + c.length, 0),
      fields: {
        name: all((c) => c.name),
        number: all((c) => c.collector_number),
        rarity: all((c) => c.rarity),
        image: all((c) => c.image_uris),
        language: all((c) => c.lang),
        finish: all((c) => c.prices && "usd_foil" in c.prices), // finish only implied by usd vs usd_foil
      },
      crossIds: { tcgplayer: pct(cards.filter((c) => c.tcgplayer_id).length, cards.length) >= 90, cardmarket: false },
      status: "ok",
      blockedReason: null,
    },
    prices: {
      eur: { source: "lorcast", url: null, updateFrequency: null, coveragePct: null, status: "ok", blockedReason: "lorcast no publica precio EUR" },
      usd: { source: "lorcast (TCGplayer)", url: API, updateFrequency: "daily", coveragePct: usd, status: "ok", blockedReason: null },
    },
    sampleSet: sample.code,
    joinPct: usd,
  };
  return {
    entry,
    sample: cards.map((c) => ({ tcgplayer: c.tcgplayer_id, number: c.collector_number })),
    tcgGroup: { name: sample.name },
    cardmarketGame: 19,
  };
}
