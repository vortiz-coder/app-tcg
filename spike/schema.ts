import { z } from "zod";

const status = z.enum(["ok", "blocked"]);

const priceSource = z.object({
  source: z.string(),
  url: z.string().url().nullable(),
  updateFrequency: z.string().nullable(),
  coveragePct: z.number().min(0).max(100).nullable(),
  status,
  blockedReason: z.string().nullable(),
});

const gameEntry = z.object({
  game: z.enum(["pokemon", "mtg", "yugioh", "onepiece", "lorcana", "riftbound"]),
  catalog: z.object({
    source: z.string(),
    url: z.string().url(),
    auth: z.enum(["none", "key", "paid"]),
    termsUrl: z.string().url().nullable(),
    termsSummary: z.string(),
    rateLimit: z.string().nullable(),
    sets: z.number().int().nullable(),
    cards: z.number().int().nullable(),
    fields: z.object({
      name: z.boolean(),
      number: z.boolean(),
      rarity: z.boolean(),
      image: z.boolean(),
      language: z.boolean(),
      finish: z.boolean(),
    }),
    crossIds: z.object({ tcgplayer: z.boolean(), cardmarket: z.boolean() }),
    status,
    blockedReason: z.string().nullable(),
  }),
  prices: z.object({ eur: priceSource, usd: priceSource }),
  sampleSet: z.string().nullable(),
  joinPct: z.number().min(0).max(100).nullable(),
  verdict: z.string().regex(/^(PASS|FAIL|UNDECIDABLE_UNDER\(.+\))$/),
});

export const report = z.object({ games: z.array(gameEntry) });
export type Report = z.infer<typeof report>;
export type GameEntry = z.infer<typeof gameEntry>;

// Not part of the report: what each probe hands to the cross-game price sources.
export type SampleRef = { tcgplayer?: number; cardmarket?: number; number?: string; rarity?: string };
export type ProbeResult = {
  entry: Omit<GameEntry, "verdict">;
  sample: SampleRef[];
  tcgGroup: { id?: number; abbr?: string; name?: string };
  cardmarketGame: number;
};
