# F0 — Spike de fuentes de datos · Requisitos

**Goal:** saber, con evidencia, de dónde salen catálogo y precios de los 6 juegos antes de diseñar el esquema definitivo y la ingesta.
**Sin código de app.** Solo scripts desechables en `spike/` y un documento de decisión.

Formato EARS. Cada requisito tiene ID y criterio de aceptación comprobable.

| ID | Requisito | Aceptación |
|---|---|---|
| DS-01 | Para cada juego (pokemon, mtg, yugioh, onepiece, lorcana, riftbound) el spike SHALL probar ≥1 fuente de catálogo y registrar: URL, auth (ninguna/key/pago), términos de uso (URL + resumen), rate limit, nº de sets, nº de cartas, campos disponibles (nombre, número, rareza, imagen, idioma, variantes/finish) e IDs cruzados (tcgplayer, cardmarket). | `spike/report.json` valida contra `spike/report.schema.json` y tiene 6 entradas en `games`. |
| DS-02 | Para cada juego el spike SHALL probar ≥1 fuente de precio EUR y ≥1 USD y registrar: frecuencia de actualización, formato, y cobertura sobre un set de muestra (% de printings con precio). | Cada entrada tiene `prices.eur` y `prices.usd` con `coveragePct` numérico o `null` + motivo. |
| DS-03 | Para cada juego el spike SHALL medir el **join** catálogo↔precio: % de 50 printings de muestra cuyo precio se puede asociar sin intervención manual. | `joinPct` por juego en el report. |
| DS-04 | WHEN una fuente requiere API key, pago o sus términos prohíben almacenar/redistribuir, el spike SHALL marcarla `blocked` y no seguir usándola. | Campo `status: ok|blocked` + `blockedReason`. |
| DS-05 | El spike SHALL NOT scrapear HTML; solo endpoints JSON/CSV o ficheros de descarga publicados. | Revisión de `spike/probes/*`: solo `fetch` a URLs de API/descarga listadas en el report. |
| DS-06 | El spike SHALL ser reproducible con un comando. | `pnpm --dir spike start` regenera `report.json` con exit code 0. |
| DS-07 | El spike SHALL emitir un veredicto por juego: `PASS` (catálogo + ≥1 precio con joinPct ≥ 90 % + términos OK), `FAIL`, o `UNDECIDABLE_UNDER(S)`. | `specs/decisions/data-sources.md` con tabla de veredictos y fuente elegida por juego. |
| DS-08 | El spike SHALL documentar qué funciones de Collectr son de pago hoy (H2 de producto), con URL y fecha de consulta. | Tabla en `specs/decisions/competitor-collectr.md` con ≥5 funciones y su URL. |

## Fuera de alcance
Guardar datos en Supabase, UI, ingesta programada.
