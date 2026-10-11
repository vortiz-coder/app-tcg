# F4b — Spike eBay · Requisitos
**Goal:** saber con evidencia si eBay puede ser la fuente de precio objetivo (ADR-002): por idioma, últimas 10 ofertas y 10 ventas.
Sin código de app. Scripts en `spike/ebay/`. Requiere credenciales de developer.ebay.com de Vik en `.env` (nunca en git).

| ID | Requisito | Aceptación |
|---|---|---|
| EB-01 | El spike SHALL comprobar el acceso a Browse API y a Marketplace Insights API con las credenciales de Vik. | report: `access.browse` y `access.insights` = ok / denied / pending + respuesta literal. |
| EB-02 | Para 50 printings de muestra por juego, el spike SHALL buscar ofertas (y ventas si hay acceso) filtrando por idioma y medir el % de anuncios que corresponden a la printing correcta (revisión manual de Vik de 20 al azar por juego). | report: `matchPrecisionPct` por juego. |
| EB-03 | El spike SHALL medir cuántas printings tienen ≥10 ofertas y ≥3 ventas por idioma (es, en, ja como mínimo). | report: cobertura por juego e idioma. |
| EB-04 | El spike SHALL estimar llamadas diarias necesarias frente a la cuota de la cuenta. | report: `dailyCallsNeeded` vs `quota`. |
| EB-05 | El spike SHALL resumir los términos de la API de eBay sobre almacenar y mostrar datos (caché, atribución, enlace). | Sección en ADR-002 con URL y fecha. |
| EB-06 | Veredicto: PASS (acceso a ventas + matchPrecision ≥ 90 % + términos OK), PASS parcial "solo ofertas", FAIL, o UNDECIDABLE_UNDER(S). | Línea en registro del roadmap y estado de ADR-002 actualizado. |
| EB-08 | Las búsquedas SHALL cubrir los 8 marketplaces UE en EUR y EBAY_US en USD de ADR-002 y el filtro SHALL excluir lotes, proxies y gradeadas del precio raw. | report: `marketplaces` = 9 y % de anuncios descartados por el filtro, con 20 descartes revisados por Vik. |
| EB-07 | Sin scraping: solo endpoints oficiales de eBay. | Revisión verifier de `spike/ebay/*`. |
