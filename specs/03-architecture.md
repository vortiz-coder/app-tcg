# Arquitectura

## Stack
| Capa | Elección | Motivo |
|---|---|---|
| App | Expo (SDK estable más reciente) + Expo Router + TypeScript estricto | iOS + Android con un código; deep links para perfil público |
| Estado servidor | TanStack Query + `@supabase/supabase-js` | Caché y reintentos sin código propio |
| Backend | Supabase: Postgres, Auth, Storage, RLS | Auth + DB + ficheros sin servidor propio |
| Ingesta de catálogo y precios | Scripts Node/TS (`packages/ingest`) ejecutados por GitHub Actions cron | Los bulk (p.ej. Scryfall) superan los límites de tiempo/memoria de Edge Functions — ver ADR-001 |
| Tests | Jest (`jest-expo`) · pgTAP (`supabase test db`) · Maestro (e2e) | Una señal externa por capa |
| Monorepo | pnpm workspaces | |

## Estructura de carpetas (objetivo tras F1)
```
apps/mobile/                 Expo app (app/ = rutas Expo Router)
  e2e/                       flujos Maestro (*.yaml)
packages/shared/             tipos DB generados, utilidades (money, i18n keys)
packages/catalog-adapters/   un adapter por juego: <game>/index.ts
packages/ingest/             CLI: ingest catalog|prices --game <id>
supabase/migrations/         SQL
supabase/tests/              pgTAP
supabase/seed.sql            datos mínimos para tests y e2e
specs/                       este directorio
.github/workflows/           ci.yml, ingest-catalog.yml, ingest-prices.yml
```

## Contrato del adapter (P3)
```ts
interface CatalogAdapter {
  game: GameId; // 'pokemon' | 'mtg' | 'yugioh' | 'onepiece' | 'lorcana' | 'riftbound'
  fetchSets(): AsyncIterable<ExternalSet>;
  fetchCards(setExternalId?: string): AsyncIterable<ExternalCard>; // incluye printings
}
interface PriceSource {
  source: 'cardmarket' | 'tcgplayer';
  currency: 'EUR' | 'USD';
  fetchPrices(game: GameId): AsyncIterable<{ externalProductId: string; finish: Finish; marketCents: number | null; lowCents: number | null; trendCents: number | null }>;
}
```
La ingesta normaliza a las tablas de abajo con `upsert` idempotente (re-ejecutar = mismo estado).

## Modelo de datos (MVP)
```
games(id text pk, name)
sets(id uuid pk, game_id fk, source, source_id, code, name, released_on date, image_url)
     unique(game_id, source, source_id)
cards(id uuid pk, game_id fk, set_id fk, source, source_id, name, number, rarity,
      image_small_url, image_large_url, search tsvector)   unique(game_id, source, source_id)
printings(id uuid pk, card_id fk, finish text, language text default 'en',
          tcgplayer_product_id text null, cardmarket_product_id text null)
          unique(card_id, finish, language)
price_points(printing_id fk, source, currency, captured_on date,
             market_cents int null, low_cents int null, trend_cents int null)
             pk(printing_id, source, captured_on)
profiles(id uuid pk = auth.users.id, username citext unique, display_name, bio,
         avatar_path, banner_path, theme jsonb, sections jsonb,
         preferred_currency text default 'EUR', is_public bool default false)
collections(id uuid pk, owner_id fk profiles, name, visibility text default 'private',
            sort_index int, created_at)
collection_items(id uuid pk, collection_id fk, printing_id fk, quantity int > 0,
                 condition text  -- NM|LP|MP|HP|DMG
                 grading_company text null, grade numeric(3,1) null,
                 purchase_cents int null, purchase_currency text null,
                 acquired_on date null, notes text, created_at)
showcase_items(profile_id fk, collection_item_id fk, position smallint)  pk(profile_id, position)
```

Previsto para eBay (ADR-002) — **no crear hasta que F4b dé PASS**:
```
market_observations(id, printing_id fk, language, kind text  -- 'sale' | 'offer'
                    marketplace text, price_cents int, shipping_cents int, currency,
                    graded bool, external_item_id text, observed_at timestamptz)
```
`price_points` sigue siendo el precio diario que lee la app; con eBay se rellena con la mediana calculada (`source='ebay'`), así la app no cambia.
- Tablas de catálogo y precios: lectura pública, escritura solo `service_role` (ingesta).
- Tablas de usuario: RLS por `auth.uid()`. Lectura pública solo si `profiles.is_public` y (para colecciones) `visibility = 'public'`.
- Preparado para v2 (social): `profiles` y `collections.visibility` ya existen; posts/follows serán tablas nuevas, sin tocar estas.

## Fuentes de datos
Vigentes (TEMPORALES): ver `decisions/data-sources.md`. Objetivo: eBay, ver `decisions/ADR-002-ebay-pricing.md`.

Tabla original de candidatas (histórico, pre-F0):
| Juego | Catálogo candidato | Precio EUR | Precio USD |
|---|---|---|---|
| Magic | Scryfall bulk data | Scryfall (`prices.eur`, origen Cardmarket) | Scryfall (`prices.usd`) / tcgcsv |
| Pokémon | pokemontcg.io / Scrydex | Cardmarket (vía API del catálogo o price guide) | tcgcsv |
| Yu-Gi-Oh! | YGOPRODeck API | YGOPRODeck (`cardmarket_price`) | YGOPRODeck / tcgcsv |
| One Piece | OPTCG API u otra | ? | tcgcsv |
| Lorcana | Lorcast API | ? | Lorcast / tcgcsv |
| Riftbound | Riftcodex / Scrydex | ? | tcgcsv |
`?` = desconocido hasta F0. Ninguna fuente entra en código sin su ficha en `specs/decisions/`.
