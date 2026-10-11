# ADR-002 — Precio objetivo basado en eBay (por idioma)

Fecha: 2026-10-11 · Estado: **ACEPTADA en diseño (Vik, 2026-10-11) — viabilidad pendiente de spike F4b** · Decide: Vik

## Contexto
Las fuentes actuales (Scryfall, TCGdex, tcgcsv, Lorcast…) son temporales (ver `data-sources.md`). Vik quiere que el precio de referencia salga del mercado real de eBay, **separado por idioma de la carta**, usando **las últimas 10 ofertas activas y las últimas 10 ventas**.

## Lo que se sabe de eBay (a verificar en F4b)
| Dato | API oficial | Acceso |
|---|---|---|
| Ofertas activas | Browse API (`item_summary/search`, filtro por categoría y `aspect_filter` de idioma) | Abierta con cuenta de developer gratuita |
| Ventas completadas | Marketplace Insights API (`item_sales/search`, ~90 días) | **Restringida**: varios developers pequeños informan de solicitudes denegadas ("solo partners") en el foro de eBay |
| Finding API `findCompletedItems` | Retirada | — |
- Scrapear las páginas de vendidos de eBay está prohibido (CLAUDE.md Never Do + constitución E5).
- Las ventas existen por marketplace; con los marketplaces UE (EUR) y ebay.com (USD) se cubren ambas monedas para los 6 juegos si hay acceso.

## Decisión propuesta
Precio de una printing, por idioma y estado (raw vs graded por separado):
- **Precio de referencia** = mediana de las últimas 10 ventas.
- **Precio de oferta** = mediana de las últimas 10 ofertas activas (precio + envío).
- Se muestran ambos y las 20 observaciones subyacentes; si hay < 3 ventas → "pocas ventas" y no hay precio de referencia (P5).
- Con solo Browse API (sin ventas): se muestra solo "precio de oferta", nunca etiquetado como precio de mercado.

## Decisiones de Vik (2026-10-11)
1. **Agregado: mediana.** Ventas y ofertas son dos precios separados (referencia = mediana ventas; oferta = mediana ofertas).
2. **Marketplaces: toda la UE en EUR** — EBAY_ES, EBAY_DE, EBAY_FR, EBAY_IT, EBAY_NL, EBAY_BE, EBAY_AT, EBAY_IE. Las "últimas 10" son las 10 más recientes sumando todos esos marketplaces. **Además ebay.com (EBAY_US) para el precio en USD** (Vik, 2026-10-11): mismo cálculo (10 ventas + 10 ofertas, mediana) por separado. EUR y USD nunca se mezclan ni se convierten (PRC-09). Con eBay activo, las fuentes temporales dejan de usarse para ambas monedas.
3. **Excluir del precio raw:** lotes, proxies/reproducciones y gradeadas (las gradeadas tienen su propio precio por empresa+nota cuando haya datos).

## Riesgos (los mide F4b)
- Emparejar anuncio → printing concreta (título libre, paralelas, idioma mal indicado).
- Acceso a Marketplace Insights → si se deniega: `UNDECIDABLE_UNDER(acceso a ventas de eBay)` y se queda con ofertas + fuentes temporales.
- Términos de la API de eBay sobre almacenar y mostrar datos (caché, atribución, enlace al anuncio).
- Cuota de llamadas: 6 juegos × miles de printings × idiomas.

## Acción inmediata (Vik, fuera de código)
Crear cuenta en developer.ebay.com y **solicitar ya** acceso a Marketplace Insights: el plazo de aprobación es desconocido y no bloquea F1–F3.
