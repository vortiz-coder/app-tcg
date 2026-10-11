import type { ProbeResult } from "../schema.ts";
import { getJson, pct } from "./http.ts";

const API = "https://api.tcgdex.net/v2/en";
const SAMPLE = 50;
const DELAY = 100; // no published limit; "please be considerate"

type SetBrief = { id: string; cardCount: { total: number } };
type SetFull = SetBrief & { name: string; releaseDate?: string; cards: { id: string }[] };
type Card = {
  name?: string; localId?: string; rarity?: string; image?: string;
  variants?: Record<string, boolean>;
  variants_detailed?: { thirdParty?: { cardmarket?: number; tcgplayer?: number } }[];
  pricing?: { cardmarket?: { idProduct?: number; trend?: number | null; avg?: number | null } | null; tcgplayer?: Record<string, unknown> | null };
};

export async function probePokemon(): Promise<ProbeResult> {
  const sets = await getJson<SetBrief[]>(`${API}/sets`, DELAY);
  const today = new Date().toISOString().slice(0, 10);

  // Listing has no release date: walk from the newest end until a released set with ≥50 cards.
  let sample: SetFull | undefined;
  for (const s of [...sets].reverse().filter((s) => s.cardCount.total >= SAMPLE)) {
    const full = await getJson<SetFull>(`${API}/sets/${s.id}`, DELAY);
    if (full.releaseDate && full.releaseDate <= today) { sample = full; break; }
  }
  if (!sample) throw new Error("pokemon: no released set with ≥50 cards");

  const cards: Card[] = [];
  for (const c of sample.cards.slice(0, SAMPLE)) cards.push(await getJson<Card>(`${API}/cards/${c.id}`, DELAY));

  const all = (f: (c: Card) => unknown) => cards.every((c) => Boolean(f(c)));
  const share = (f: (c: Card) => unknown) => pct(cards.filter(f).length, cards.length);
  const eur = share((c) => c.pricing?.cardmarket?.trend != null || c.pricing?.cardmarket?.avg != null);
  const usd = share((c) => Object.values(c.pricing?.tcgplayer ?? {}).some((v) => typeof v === "object" && v !== null));
  const joinPct = Math.max(eur, usd);

  const entry: ProbeResult["entry"] = {
    game: "pokemon",
    catalog: {
      source: "tcgdex",
      url: API,
      auth: "none",
      termsUrl: "https://tcgdex.dev/faq",
      termsSummary:
        "API gratuita sin key; base de datos open source (repo cards-database, licencia MIT). Sin rate limit publicado " +
        "(\"be considerate\"), recomiendan cachear. Los precios (Cardmarket/TCGplayer) no tienen términos propios publicados.",
      rateLimit: null,
      sets: sets.length,
      cards: sets.reduce((n, s) => n + s.cardCount.total, 0),
      fields: {
        name: all((c) => c.name),
        number: all((c) => c.localId),
        rarity: all((c) => c.rarity),
        image: all((c) => c.image),
        language: true, // one endpoint per language (/v2/{lang}/…)
        finish: all((c) => c.variants && Object.keys(c.variants).length),
      },
      crossIds: {
        tcgplayer: share((c) => c.variants_detailed?.some((v) => v.thirdParty?.tcgplayer)) >= 90,
        cardmarket: share((c) => c.variants_detailed?.some((v) => v.thirdParty?.cardmarket)) >= 90,
      },
      status: "ok",
      blockedReason: null,
    },
    prices: {
      eur: { source: "tcgdex (Cardmarket)", url: API, updateFrequency: "daily", coveragePct: eur, status: "ok", blockedReason: null },
      usd: { source: "tcgdex (TCGplayer)", url: API, updateFrequency: "hourly-daily", coveragePct: usd, status: "ok", blockedReason: null },
    },
    sampleSet: sample.id,
    joinPct,
  };
  return {
    entry,
    sample: cards.map((c) => ({
      tcgplayer: c.variants_detailed?.[0]?.thirdParty?.tcgplayer,
      cardmarket: c.variants_detailed?.[0]?.thirdParty?.cardmarket,
    })),
    tcgGroup: { name: sample.name },
    cardmarketGame: 6,
  };
}
