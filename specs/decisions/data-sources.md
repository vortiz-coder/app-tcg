# Fuentes de datos por juego (resultado de F0)

Fecha: 2026-10-11 · Evidencia: `spike/report.json` (regenerable con `pnpm --dir spike start`) · Requisito: DS-07

Criterio de veredicto (DS-07): `PASS` = catálogo + ≥1 precio con joinPct ≥ 90 % + términos OK.
Muestra: 50 printings del set más reciente ya publicado con ≥ 50 cartas (en onepiece: último set del listado de optcgapi, que no da fechas).

## Veredictos

| Juego | Catálogo | EUR (cobertura) | USD (cobertura) | joinPct | Veredicto |
|---|---|---|---|---|---|
| mtg | Scryfall | Scryfall←Cardmarket 100 % · Cardmarket guide 100 % | Scryfall←TCGplayer 100 % · tcgcsv 100 % | 100 | PASS |
| pokemon | TCGdex | TCGdex←Cardmarket 100 % · Cardmarket guide 100 % | TCGdex 0 % (set nuevo sin precio) · tcgcsv 100 % | 100 | UNDECIDABLE_UNDER(términos de tcgdex no aclaran almacenamiento de precios) |
| yugioh | YGOPRODeck | Cardmarket guide 0 % (nombres sin número; YGOPRODeck solo da mínimo por carta) | YGOPRODeck `set_price` 0 % · tcgcsv 96 % (número + rareza) | 96 | UNDECIDABLE_UNDER(tcgcsv sin términos publicados; redistribuye la API de TCGplayer) |
| onepiece | optcgapi | Cardmarket guide 0 % (50/50 números con varias versiones) | optcgapi 100 % · tcgcsv 54 % (paralelas comparten número) | 100 | UNDECIDABLE_UNDER(optcgapi sin términos y con datos scrapeados por su autor: incompatible con E5 salvo aclaración) |
| lorcana | Lorcast | Cardmarket guide 0 % (Lorcast no da EUR ni id Cardmarket; nombres de producto sin número) | Lorcast←TCGplayer 100 % · tcgcsv 100 % | 100 | PASS |
| riftbound | Riftcodex | Cardmarket guide 0 % (solo `cardmarket_id` por set; nombres de producto sin número) | tcgcsv 86 % (14 % de cartas sin `tcgplayer_id`) | 86 | FAIL |

Nota de evidencia (EUR lorcana/riftbound): en `products_singles_19.json` (Lorcana) solo 17/3424 nombres contienen dígitos y son parte del nombre ("Stitch - Experiment 626"); en `products_singles_22.json` (Riftbound) 0/1456. Cardmarket no expone número de colección en el nombre: el 0 % no depende del regex del spike.

## Fuentes evaluadas

| Fuente | Tipo | Auth | Términos (resumen) | Rate limit |
|---|---|---|---|---|
| Scryfall | catálogo + precios mtg | ninguna | Uso libre; prohibido paywall, juegos nuevos, endorsement, alterar imágenes. Cachear ≥ 24 h. Precios "dangerously stale" tras 24 h: solo estimación/tendencia (encaja con nuestro uso). | 10 req/s; bulk sin límite |
| TCGdex | catálogo + precios pokemon | ninguna | Catálogo open source (MIT). Precios Cardmarket/TCGplayer sin términos propios. | no publicado |
| YGOPRODeck | catálogo yugioh | ninguna | Gratis; exige guardar datos en local y re-alojar imágenes (no hotlink). © Konami. | 20 req/s, bloqueo 1 h |
| optcgapi | catálogo + USD onepiece | ninguna | Sin licencia ni términos; el autor scrapea la web (TCGplayer). Límites diarios no cuantificados. | no publicado |
| Lorcast | catálogo + USD lorcana | ninguna | Prohíbe cobrar por su contenido; cachear ≥ 24 h; Community Code Policy de Ravensburger. | ~10 req/s |
| Riftcodex | catálogo riftbound | ninguna | Fan project no oficial, WIP, sin licencia ni términos. | no publicado |
| tcgcsv | USD transversal (6 juegos) | ninguna | Espejo diario de la API de TCGplayer; sin términos publicados. | pausa 0,25 s |
| Cardmarket Price Guide | EUR transversal (descarga JSON pública) | ninguna | **No verificado**: la web de Cardmarket devuelve 403 al lector automático. | — |

## Fuente elegida por juego (provisional hasta resolver los UNDECIDABLE)

| Juego | Catálogo | EUR | USD |
|---|---|---|---|
| mtg | Scryfall (bulk diario) | Scryfall | Scryfall |
| pokemon | TCGdex | TCGdex o Cardmarket guide (ambos 100 %, términos pendientes) | tcgcsv (términos pendientes) |
| yugioh | YGOPRODeck | — (sin join automático) | tcgcsv por número+rareza (términos pendientes) |
| onepiece | pendiente (optcgapi no cumple E5) | — | pendiente |
| lorcana | Lorcast | — (P4: sin EUR) | Lorcast |
| riftbound | pendiente | — | tcgcsv 86 % |

## Orden recomendado de incorporación en F2
1. **mtg** — PASS limpio, EUR+USD, bulk diario.
2. **lorcana** — PASS con USD; mostrar "sin precio" en EUR (P5) hasta tener fuente EUR.
3. **pokemon** — datos completos; bloqueado solo por términos de precios.
4. **yugioh** — catálogo OK; USD vía tcgcsv; EUR sin solución automática.
5. **onepiece**, **riftbound** — necesitan fuente de catálogo/precio con términos claros.

## Decisiones que necesita Vik (cada UNDECIDABLE nombra lo que falta)
- **Cardmarket Price Guide**: leer manualmente los términos de la descarga pública (`downloads.s3.cardmarket.com/productCatalog/...`). Si permiten almacenar, desbloquea EUR para pokemon (100 %) y refuerza mtg.
- **tcgcsv**: decidir si es aceptable redistribuir datos de la API de TCGplayer vía un espejo sin términos (afecta USD de pokemon, yugioh, riftbound). Alternativa: API oficial de TCGplayer (cerrada a nuevos desarrolladores; no verificado en este spike).
- **TCGdex precios**: preguntar al proyecto (GitHub/Discord) si los precios pueden almacenarse.
- **One Piece**: optcgapi no cumple E5. Buscar fuente oficial (Bandai no publica API conocida) o aceptar catálogo vía tcgcsv (productos TCGplayer) como catálogo.
- **Riftbound**: Riftcodex sin términos y 86 % de join en el set más reciente; reevaluar cuando el set madure o usar tcgcsv como catálogo.
- **P4 (euro primero)**: solo mtg tiene EUR con términos claros hoy. Lorcana, yugioh, onepiece y riftbound no tienen EUR asociable automáticamente.

## Consecuencias para el modelo (F2/F4)
- `printing` necesita `tcgplayer_product_id` y `cardmarket_product_id` (nullable) y la `source` del precio; en yugioh/onepiece el join es por número (+ rareza), no por id.
- Las paralelas/versiones comparten número en onepiece y yugioh: el modelo debe distinguir variante además de número.
- Todos los precios son diarios: la ingesta de F4 basta con 1×/día (encaja con la métrica de ≤ 48 h).
- YGOPRODeck exige re-alojar imágenes: F2 necesita Storage propio para imágenes de yugioh.

## Decisión de Vik (2026-10-11): fuentes TEMPORALES
> "Usa lo que tengas a mano y márcalo como temporal; lo miramos más adelante."

Se desbloquea F2/F4 con las fuentes de abajo. **Todas son TEMPORALES** hasta que se resuelva la fuente objetivo (eBay, ver `ADR-002-ebay-pricing.md`).
Excepción temporal explícita a la constitución E5 para las fuentes sin términos claros (marcadas ⚠). No se amplía su uso más allá de esta tabla sin preguntar.

| Juego | Catálogo | EUR | USD | Estado |
|---|---|---|---|---|
| mtg | Scryfall | Scryfall | Scryfall | TEMPORAL (precio) · catálogo definitivo |
| pokemon | TCGdex | TCGdex ⚠ | tcgcsv ⚠ | TEMPORAL |
| yugioh | YGOPRODeck (imágenes re-alojadas en Storage) | — sin precio | tcgcsv ⚠ (número+rareza) | TEMPORAL |
| onepiece | optcgapi ⚠ | — sin precio | optcgapi ⚠ | TEMPORAL |
| lorcana | Lorcast | — sin precio | Lorcast | TEMPORAL (precio) · catálogo definitivo |
| riftbound | Riftcodex ⚠ | — sin precio | tcgcsv ⚠ (86 %; el resto "sin precio") | TEMPORAL |

Reglas mientras sean temporales:
- Cada fuente vive en su adapter; nada fuera del adapter sabe de qué fuente viene el precio salvo `price_points.source`.
- La UI muestra siempre fuente + fecha (P4/P5) y "sin precio" donde no haya.
- Revisión pendiente: antes de lanzar públicamente (no antes de F4b).
