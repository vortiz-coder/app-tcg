# F4 — Precios · Requisitos
**Goal:** saber cuánto vale mi colección y cómo evoluciona, en EUR por defecto, gratis y con historial completo (P1, P4, P5).

| ID | Requisito | Aceptación |
|---|---|---|
| PRC-01 | El sistema SHALL guardar a diario un `price_point` por printing y fuente (EUR y USD según F0). | Workflow `ingest-prices.yml` verde; fila con `captured_on = hoy`. |
| PRC-02 | La ingesta de precios SHALL ser idempotente por (printing, fuente, día). | Test: dos ejecuciones el mismo día → mismo nº de filas. |
| PRC-03 | El usuario SHALL ver el precio de mercado de cada carta en su moneda preferida, con fuente y fecha visibles. | Maestro: detalle muestra "Cardmarket · <fecha>". |
| PRC-04 | IF no hay precio, la UI SHALL mostrar "Sin precio" y excluir el ítem del total indicando cuántos se excluyen. | Jest del componente + pgTAP de la función de valor. |
| PRC-05 | El sistema SHALL calcular el valor total por carpeta y global = Σ(cantidad × precio de mercado de la printing), en céntimos. | pgTAP con fixture de valores conocidos. |
| PRC-06 | El usuario SHALL ver el historial de precio de una carta y del valor de su colección en rangos 7d/30d/90d/1a/todo, sin límite (P1). | Maestro screenshot del gráfico con fixture de 365 días. |
| PRC-07 | El usuario SHALL ver ganancia/pérdida frente al precio de compra cuando lo haya indicado y la moneda coincida. | Jest de la función de cálculo. |
| PRC-08 | Las cartas gradeadas SHALL mostrarse con precio de la printing sin gradear y la etiqueta "precio raw" hasta tener fuente de precio graded. | Jest/visual. |
| PRC-09 | La conversión de moneda NO SHALL hacerse: cada moneda usa su propia fuente; si falta la fuente de esa moneda → "Sin precio". | Revisión verifier. |
| PRC-10 | Mientras las fuentes sean TEMPORALES, el sistema SHALL usar las de `decisions/data-sources.md`, cada una en su adapter. | Revisión verifier: ninguna referencia a una fuente fuera de `packages/catalog-adapters/` o `packages/ingest/`. |

## Objetivo eBay (ADR-002) — solo se implementa si F4b da PASS
| ID | Requisito | Aceptación |
|---|---|---|
| PRC-11 | El sistema SHALL guardar, por printing e idioma, las últimas 10 ventas y las últimas 10 ofertas activas de eBay por moneda: marketplaces UE para EUR y ebay.com para USD (ADR-002), obtenidas por API oficial. | Test de ingesta con fixture de respuesta de eBay: 10 + 10 filas en `market_observations`. |
| PRC-12 | El precio de referencia SHALL ser el agregado de las 10 ventas = **mediana** de las 10 ventas más recientes por moneda (UE → EUR, ebay.com → USD; ADR-002), separado por idioma y raw/graded; lotes y proxies excluidos. | Test SQL con fixture de valores conocidos. |
| PRC-13 | IF hay < 3 ventas, la UI SHALL mostrar "pocas ventas" y no dar precio de referencia; el precio de oferta se muestra aparte y etiquetado como tal. | Jest del componente. |
| PRC-14 | El usuario SHALL poder ver las 20 observaciones (precio, fecha, enlace al anuncio) de una carta. | Maestro abre la lista. |
