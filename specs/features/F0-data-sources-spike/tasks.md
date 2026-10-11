# F0 — Tareas

Una tarea por prompt. Marca `[x]` y pega la evidencia.

- [x] **F0-T1** Crear `spike/` (package.json, run.ts vacío que escribe `{ "games": [] }`, schema zod→JSON).
  Done = `pnpm --dir spike start` exit 0 y `report.json` existe.  (DS-06)
  ↳ 2026-10-11 PASS: report.json written: 0 games (exit 0)
- [x] **F0-T2** Probe `mtg` (Scryfall).  Done = entrada `mtg` válida contra schema.  (DS-01..05)
  ↳ 2026-10-11 PASS: mtg: join 100% → PASS · report.json written: 1 games (exit 0)
- [x] **F0-T3** Probe `pokemon`.  Done = entrada `pokemon` válida.
  ↳ 2026-10-11 PASS: pokemon: join 100% → UNDECIDABLE_UNDER(términos de tcgdex no aclaran almacenamiento de precios) · report.json written: 2 games (exit 0)
- [x] **F0-T4** Probe `yugioh`.  Done = entrada `yugioh` válida.
  ↳ 2026-10-11 PASS: yugioh: join 0% → FAIL · report.json written: 3 games (exit 0). Entrada válida; FAIL de fuente: ygoprodeck `set_price`=0 en todos los sets recientes y EUR solo por carta. Se recalcula en T7.
- [x] **F0-T5** Probe `onepiece` + `lorcana`.  Done = ambas entradas válidas.
  ↳ 2026-10-11 PASS: onepiece: join 100% → UNDECIDABLE_UNDER(optcgapi sin términos y con datos scrapeados…) · lorcana: join 100% → PASS · report.json written: 5 games (exit 0)
- [x] **F0-T6** Probe `riftbound`.  Done = entrada `riftbound` válida.
  ↳ 2026-10-11 PASS: riftbound: join null% → UNDECIDABLE_UNDER(sin fuente de precio hasta T7…) · report.json written: 6 games (exit 0)
- [x] **F0-T7** Probes transversales de precio (`tcgcsv`, price guide de Cardmarket si existe descarga pública) y recalcular `coveragePct`/`joinPct` de los 6 juegos.
  Done = `pnpm --dir spike start` → 6 juegos, ningún `coveragePct` sin motivo si es `null`.  (DS-02, DS-03)
  ↳ 2026-10-11 PASS: report.json written: 6 games (exit 0) · check: games 6 null-without-reason 0
- [x] **F0-T8** Escribir `specs/decisions/data-sources.md` con tabla de veredictos.  Done = 6 filas, cada veredicto es PASS/FAIL/UNDECIDABLE_UNDER(S).  (DS-07)
  ↳ 2026-10-11 PASS: rows 6 valid true (mtg PASS, pokemon/yugioh/onepiece UNDECIDABLE_UNDER, lorcana PASS, riftbound FAIL)
- [x] **F0-T9** `specs/decisions/competitor-collectr.md`.  Done = ≥5 funciones con URL y fecha.  (DS-08)
  ↳ 2026-10-11 PASS: features 6 withUrl 6 date true
- [x] **F0-T10** Verificación por el subagente `verifier` contra este requirements.md y registro en `specs/02-roadmap.md#registro`.
  ↳ 2026-10-11 PASS: verifier 2ª pasada — DS-01..DS-08 PASS, global PASS (1ª pasada FAIL por DS-05: URLs de precio ausentes del report; corregido)
