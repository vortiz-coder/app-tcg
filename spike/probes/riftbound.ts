import type { ProbeResult } from "../schema.ts";
import { getJson, pct } from "./http.ts";

const API = "https://api.riftcodex.com";
const SAMPLE = 50;
const DELAY = 500; // no published limit

type RSet = { set_id: string; tcgplayer_id?: string; card_count: number; published_on?: string };
type RCard = {
  name?: string; collector_number?: number; tcgplayer_id?: string | null;
  classification?: { rarity?: string }; media?: { image_url?: string };
  metadata?: { alternate_art?: boolean; signature?: boolean };
};
type Page<T> = { items: T[]; total: number };

export async function probeRiftbound(): Promise<ProbeResult> {
  const sets = (await getJson<Page<RSet>>(`${API}/sets`, DELAY)).items;
  const total = (await getJson<Page<RCard>>(`${API}/cards?size=1`, DELAY)).total;
  const today = new Date().toISOString().slice(0, 10);
  const sample = sets
    .filter((s) => s.card_count >= SAMPLE && s.published_on && s.published_on.slice(0, 10) <= today)
    .sort((a, b) => b.published_on!.localeCompare(a.published_on!))[0];
  const cards = (await getJson<Page<RCard>>(`${API}/cards?set_id=${sample.set_id}&size=${SAMPLE}`, DELAY)).items;

  const all = (f: (c: RCard) => unknown) => cards.every((c) => Boolean(f(c)));

  const entry: ProbeResult["entry"] = {
    game: "riftbound",
    catalog: {
      source: "riftcodex",
      url: API,
      auth: "none",
      termsUrl: "https://riftcodex.com/docs",
      termsSummary:
        "Fan project no oficial (sin afiliación con Riot), lectura sin key, API en WIP (v0.2). Sin licencia, términos ni " +
        "rate limit publicados. Sin precios; expone tcgplayer_id por carta y cardmarket_id por set.",
      rateLimit: null,
      sets: sets.length,
      cards: total,
      fields: {
        name: all((c) => c.name),
        number: all((c) => c.collector_number != null),
        rarity: all((c) => c.classification?.rarity),
        image: all((c) => c.media?.image_url),
        language: false, // English only
        finish: false, // only alternate_art/signature flags, no foil/finish field
      },
      crossIds: { tcgplayer: pct(cards.filter((c) => c.tcgplayer_id).length, cards.length) >= 90, cardmarket: false },
      status: "ok",
      blockedReason: null,
    },
    prices: {
      eur: { source: "riftcodex", url: null, updateFrequency: null, coveragePct: null, status: "ok", blockedReason: "riftcodex no publica precios" },
      usd: { source: "riftcodex", url: null, updateFrequency: null, coveragePct: null, status: "ok", blockedReason: "riftcodex no publica precios" },
    },
    sampleSet: sample.set_id,
    joinPct: null,
  };
  return {
    entry,
    sample: cards.map((c) => ({ tcgplayer: c.tcgplayer_id ? Number(c.tcgplayer_id) : undefined, number: String(c.collector_number) })),
    tcgGroup: { id: sample.tcgplayer_id ? Number(sample.tcgplayer_id) : undefined, abbr: sample.set_id },
    cardmarketGame: 22,
  };
}
