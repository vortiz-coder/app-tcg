import type { ProbeResult } from "../schema.ts";
import { getJson, pct } from "./http.ts";

const API = "https://api.scryfall.com";
const SAMPLE = 50;

type ScrySet = { code: string; tcgplayer_id?: number; set_type: string; released_at?: string; card_count: number; digital: boolean };
type ScryCard = {
  name?: string; collector_number?: string; rarity?: string; lang?: string; finishes?: string[];
  image_uris?: object; card_faces?: { image_uris?: object }[];
  tcgplayer_id?: number; cardmarket_id?: number;
  prices: Record<string, string | null>;
};

const hasAny = (p: ScryCard["prices"], keys: string[]) => keys.some((k) => p[k] != null);

export async function probeMtg(): Promise<ProbeResult> {
  const sets = (await getJson<{ data: ScrySet[] }>(`${API}/sets`, 100)).data;
  const today = new Date().toISOString().slice(0, 10);
  const sample = sets
    .filter((s) => !s.digital && ["expansion", "core"].includes(s.set_type) && s.card_count >= SAMPLE)
    .filter((s) => s.released_at && s.released_at <= today)
    .sort((a, b) => b.released_at!.localeCompare(a.released_at!))[0];

  const cards = (await getJson<{ data: ScryCard[] }>(
    `${API}/cards/search?q=${encodeURIComponent(`e:${sample.code}`)}&unique=prints&order=set`, 500,
  )).data.slice(0, SAMPLE);

  const all = (f: (c: ScryCard) => unknown) => cards.every((c) => Boolean(f(c)));
  const most = (f: (c: ScryCard) => unknown) => pct(cards.filter(f).length, cards.length) >= 90;
  const eur = pct(cards.filter((c) => hasAny(c.prices, ["eur", "eur_foil", "eur_etched"])).length, cards.length);
  const usd = pct(cards.filter((c) => hasAny(c.prices, ["usd", "usd_foil", "usd_etched"])).length, cards.length);
  const joinPct = Math.max(eur, usd);

  const entry: ProbeResult["entry"] = {
    game: "mtg",
    catalog: {
      source: "scryfall",
      url: API,
      auth: "none",
      termsUrl: "https://scryfall.com/docs/api",
      termsSummary:
        "Uso libre con User-Agent/Accept; prohibido paywall de sus datos, crear juegos nuevos o implicar endorsement; " +
        "imágenes sin alterar. Recomiendan cachear ≥24h y usar bulk data diario.",
      rateLimit: "10 req/s general; 2 req/s en /cards/search; bulk en *.scryfall.io sin límite",
      sets: sets.length,
      cards: sets.reduce((n, s) => n + s.card_count, 0),
      fields: {
        name: all((c) => c.name),
        number: all((c) => c.collector_number),
        rarity: all((c) => c.rarity),
        image: all((c) => c.image_uris ?? c.card_faces?.[0]?.image_uris),
        language: all((c) => c.lang),
        finish: all((c) => c.finishes?.length),
      },
      crossIds: { tcgplayer: most((c) => c.tcgplayer_id), cardmarket: most((c) => c.cardmarket_id) },
      status: "ok",
      blockedReason: null,
    },
    prices: {
      eur: { source: "scryfall (Cardmarket)", url: API, updateFrequency: "daily", coveragePct: eur, status: "ok", blockedReason: null },
      usd: { source: "scryfall (TCGplayer)", url: API, updateFrequency: "daily", coveragePct: usd, status: "ok", blockedReason: null },
    },
    sampleSet: sample.code,
    joinPct,
  };
  return {
    entry,
    sample: cards.map((c) => ({ tcgplayer: c.tcgplayer_id, cardmarket: c.cardmarket_id })),
    tcgGroup: { id: sample.tcgplayer_id },
    cardmarketGame: 1,
  };
}
