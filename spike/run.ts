import { writeFileSync } from "node:fs";
import { z } from "zod";
import { report, type GameEntry, type ProbeResult } from "./schema.ts";
import { probeMtg } from "./probes/mtg.ts";
import { probePokemon } from "./probes/pokemon.ts";
import { probeYugioh } from "./probes/yugioh.ts";
import { probeOnepiece } from "./probes/onepiece.ts";
import { probeLorcana } from "./probes/lorcana.ts";
import { probeRiftbound } from "./probes/riftbound.ts";
import { tcgcsvCoverage, TCGCSV_URL } from "./probes/prices/tcgcsv.ts";
import { cardmarketCoverage, CARDMARKET_URL } from "./probes/prices/cardmarket.ts";

type Price = GameEntry["prices"]["eur"];

// Terms reviewed by hand on 2026-10-11 (see termsSummary in each probe). null = terms allow our use.
const CATALOG_ISSUE: Record<string, string | null> = {
  scryfall: null,
  tcgdex: null,
  ygoprodeck: null,
  lorcast: null,
  optcgapi: "optcgapi sin términos y con datos scrapeados por su autor: incompatible con E5 salvo aclaración",
  riftcodex: "riftcodex sin licencia ni términos publicados",
};
const PRICE_ISSUE: Record<string, string | null> = {
  scryfall: null,
  ygoprodeck: null,
  lorcast: null,
  tcgdex: "términos de tcgdex no aclaran almacenamiento de precios",
  optcgapi: "optcgapi sin términos y con precios scrapeados de TCGplayer (E5)",
  riftcodex: "riftcodex no publica precios",
  tcgcsv: "tcgcsv sin términos publicados; redistribuye la API de TCGplayer",
  cardmarket: "términos de la descarga Price Guide de Cardmarket no verificados (su web devuelve 403 al lector)",
};
const key = (source: string) => source.split(" ")[0];
const usable = (p: Price) => (p.coveragePct ?? 0) >= 90;

function pick(embedded: Price, other: Price): Price {
  if (other.coveragePct == null) {
    return embedded.coveragePct == null
      ? { ...embedded, blockedReason: `${embedded.blockedReason}; ${other.blockedReason}` }
      : embedded;
  }
  const ok = (p: Price) => usable(p) && PRICE_ISSUE[key(p.source)] == null;
  if (ok(embedded)) return embedded;
  if (ok(other)) return other;
  return other.coveragePct > (embedded.coveragePct ?? -1) ? other : embedded;
}

function verdict(e: Omit<GameEntry, "verdict">): string {
  const priced = [e.prices.eur, e.prices.usd].filter(usable);
  if (priced.length === 0) return "FAIL";
  const catalogIssue = CATALOG_ISSUE[e.catalog.source];
  if (catalogIssue) return `UNDECIDABLE_UNDER(${catalogIssue})`;
  if (priced.some((p) => PRICE_ISSUE[key(p.source)] == null)) return "PASS";
  return `UNDECIDABLE_UNDER(${PRICE_ISSUE[key(priced[0].source)]})`;
}

const probes: (() => Promise<ProbeResult>)[] = [probeMtg, probePokemon, probeYugioh, probeOnepiece, probeLorcana, probeRiftbound];

const games: GameEntry[] = [];
for (const probe of probes) {
  const p = await probe();
  const cm = await cardmarketCoverage(p);
  const tcg = await tcgcsvCoverage(p);
  const eur = pick(p.entry.prices.eur, {
    source: "cardmarket price guide", url: CARDMARKET_URL, updateFrequency: "daily", status: "ok",
    coveragePct: cm.coveragePct, blockedReason: cm.reason,
  });
  const usd = pick(p.entry.prices.usd, {
    source: "tcgcsv (TCGplayer)", url: TCGCSV_URL, updateFrequency: "daily (~24h)", status: "ok",
    coveragePct: tcg.coveragePct, blockedReason: tcg.reason,
  });
  const covs = [eur.coveragePct, usd.coveragePct].filter((c): c is number => c != null);
  const entry = { ...p.entry, prices: { eur, usd }, joinPct: covs.length ? Math.max(...covs) : null };
  games.push({ ...entry, verdict: verdict(entry) });
  console.log(
    `${p.entry.game}: eur ${p.entry.prices.eur.source}=${p.entry.prices.eur.coveragePct} cardmarket=${cm.coveragePct}` +
      ` · usd ${p.entry.prices.usd.source}=${p.entry.prices.usd.coveragePct} tcgcsv=${tcg.coveragePct}`,
  );
}
const out = report.parse({ games });

writeFileSync("report.schema.json", JSON.stringify(z.toJSONSchema(report), null, 2) + "\n");
writeFileSync("report.json", JSON.stringify(out, null, 2) + "\n");
for (const g of out.games) console.log(`${g.game}: join ${g.joinPct}% → ${g.verdict}`);
console.log(`report.json written: ${out.games.length} games`);
