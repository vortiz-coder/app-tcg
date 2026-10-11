# F0 — Diseño

## Estructura
```
spike/
  package.json        scripts: { "start": "tsx run.ts" }  deps: tsx, zod (Ask First ya aprobado al aprobar este spec)
  run.ts              ejecuta todas las probes en serie y escribe report.json
  report.schema.json  JSON Schema del report (lo genera zod → json)
  probes/<game>.ts    una probe por juego: catálogo + precios + join
  probes/prices/tcgcsv.ts, probes/prices/cardmarket.ts   fuentes de precio transversales
  report.json         salida (se commitea: es la evidencia)
```

## Forma del report (por juego)
```json
{
  "game": "mtg",
  "catalog": { "source": "scryfall", "url": "...", "auth": "none", "termsUrl": "...", "termsSummary": "...",
               "rateLimit": "10 req/s", "sets": 0, "cards": 0,
               "fields": { "name": true, "number": true, "rarity": true, "image": true, "language": true, "finish": true },
               "crossIds": { "tcgplayer": true, "cardmarket": true }, "status": "ok", "blockedReason": null },
  "prices": {
    "eur": { "source": "...", "updateFrequency": "daily", "coveragePct": 0, "status": "ok", "blockedReason": null },
    "usd": { "source": "...", "updateFrequency": "daily", "coveragePct": 0, "status": "ok", "blockedReason": null }
  },
  "sampleSet": "código del set de muestra",
  "joinPct": 0,
  "verdict": "PASS | FAIL | UNDECIDABLE_UNDER(...)"
}
```

## Método
1. Elegir como set de muestra el set **más reciente con ≥ 50 cartas** de cada juego (los recientes son los que peor cobertura suelen tener).
2. Contar sets/cartas con el endpoint de listado (sin descargar imágenes).
3. Tomar 50 printings del set de muestra y buscar su precio en cada fuente → `coveragePct` y `joinPct`.
4. Términos de uso: leer y resumir en 1–2 frases; si es ambiguo → `UNDECIDABLE_UNDER(términos de <fuente> no aclaran almacenamiento)`.
5. Respetar rate limits declarados (pausa entre requests).

## Decisión que produce
`specs/decisions/data-sources.md`: por juego, fuente de catálogo elegida, fuente EUR, fuente USD, veredicto, y orden recomendado de incorporación en F2. Esto alimenta la columna `source` del modelo y el diseño de F2/F4.
