import type { ProbeResult } from "../schema.ts";
import { getJson, pct } from "./http.ts";

const API = "https://db.ygoprodeck.com/api/v7";
const SAMPLE = 50;
const DELAY = 100; // 20 req/s hard limit

type CardSet = { set_name: string; set_code: string; num_of_cards: number; tcg_date?: string };
type Printing = { set_name: string; set_code: string; set_rarity?: string; set_price?: string };
type Card = {
  name: string;
  card_images?: unknown[];
  card_sets?: Printing[];
  card_prices?: { cardmarket_price?: string; tcgplayer_price?: string }[];
};

export async function probeYugioh(): Promise<ProbeResult> {
  const sets = await getJson<CardSet[]>(`${API}/cardsets.php`, DELAY);
  const today = new Date().toISOString().slice(0, 10);
  const sample = sets
    .filter((s) => s.num_of_cards >= SAMPLE && s.tcg_date && s.tcg_date <= today)
    .sort((a, b) => b.tcg_date!.localeCompare(a.tcg_date!))[0];

  const cards = (await getJson<{ data: Card[] }>(`${API}/cardinfo.php?cardset=${encodeURIComponent(sample.set_name)}`, DELAY)).data;
  const printings = cards
    .flatMap((c) => (c.card_sets ?? []).filter((p) => p.set_name === sample.set_name).map((p) => ({ card: c, p })))
    .slice(0, SAMPLE);

  const all = (f: (x: (typeof printings)[number]) => unknown) => printings.every((x) => Boolean(f(x)));
  // set_price is per printing (USD); cardmarket_price is only the lowest across all printings of the card.
  const usd = pct(printings.filter((x) => Number(x.p.set_price) > 0).length, printings.length);

  const entry: ProbeResult["entry"] = {
    game: "yugioh",
    catalog: {
      source: "ygoprodeck",
      url: API,
      auth: "none",
      termsUrl: "https://ygoprodeck.com/api-guide/",
      termsSummary:
        "API gratuita sin key; exigen descargar y guardar los datos en local e imágenes re-alojadas (no hotlink) bajo pena de " +
        "blacklist. Textos e imágenes © Konami/4K Media. Sin restricción comercial explícita.",
      rateLimit: "20 req/s (exceso = bloqueo 1 h)",
      sets: sets.length,
      cards: sets.reduce((n, s) => n + s.num_of_cards, 0),
      fields: {
        name: all((x) => x.card.name),
        number: all((x) => x.p.set_code),
        rarity: all((x) => x.p.set_rarity),
        image: all((x) => x.card.card_images?.length),
        language: true, // ?language=fr|de|it|pt (no es)
        finish: false, // finish is folded into set_rarity (e.g. "Secret Rare"), no separate field
      },
      crossIds: { tcgplayer: false, cardmarket: false },
      status: "ok",
      blockedReason: null,
    },
    prices: {
      eur: {
        source: "ygoprodeck (Cardmarket)", url: API,
        updateFrequency: "daily (cache 2 días)",
        coveragePct: null,
        status: "ok",
        blockedReason: "solo cardmarket_price mínimo por carta, no por printing: no asociable a una printing concreta",
      },
      usd: { source: "ygoprodeck set_price", url: API, updateFrequency: "daily (cache 2 días)", coveragePct: usd, status: "ok", blockedReason: null },
    },
    sampleSet: sample.set_code,
    joinPct: usd,
  };
  return {
    entry,
    sample: printings.map((x) => ({ number: x.p.set_code, rarity: x.p.set_rarity })),
    tcgGroup: { abbr: sample.set_code },
    cardmarketGame: 3,
  };
}
