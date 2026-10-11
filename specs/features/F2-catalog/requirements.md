# F2 — Catálogo multi-TCG · Requisitos
**Goal:** que el usuario encuentre cualquier carta de los juegos soportados en segundos.
Depende de: veredictos de F0. Solo juegos con PASS entran; el resto queda en sub-fase posterior.

| ID | Requisito | Aceptación |
|---|---|---|
| CAT-01 | El sistema SHALL ingerir sets, cartas y printings de cada juego desde la fuente elegida en F0 mediante `pnpm ingest catalog --game <id>`. | Tras ejecutar, nº de cartas en DB = nº del report F0 ± 1 %. |
| CAT-02 | La ingesta SHALL ser idempotente. | Ejecutarla dos veces seguidas no cambia `count(*)` ni `updated_at` de filas sin cambios (test). |
| CAT-03 | La ingesta SHALL ejecutarse automáticamente a diario por GitHub Actions. | Workflow `ingest-catalog.yml` con run verde. |
| CAT-04 | El usuario SHALL poder buscar por nombre (tolerante a acentos y mayúsculas) y filtrar por juego y set. | Maestro: buscar "pikachu" con filtro Pokémon devuelve ≥1 resultado; pgTAP de la función de búsqueda. |
| CAT-05 | La búsqueda SHALL devolver la primera página en < 500 ms p95 con el catálogo completo. | Script de carga `pnpm bench:search` sobre DB local con datos reales. |
| CAT-06 | El usuario SHALL ver el detalle de carta: imagen, set, número, rareza, printings disponibles. | Maestro abre detalle y ve los campos. |
| CAT-07 | Las tablas de catálogo SHALL ser de lectura pública y escritura solo `service_role`. | pgTAP: `authenticated` no puede insertar. |
| CAT-08 | Las imágenes SHALL respetar los términos de la fuente (hotlink o copia en Storage según ficha F0). | Revisión del verifier contra `decisions/data-sources.md`. |
