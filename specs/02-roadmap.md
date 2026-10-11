# Roadmap y registro de fases

Regla: una fase a la vez. Solo la fase **actual** tiene `design.md` + `tasks.md` detallados; las siguientes solo `requirements.md` (se diseñan al llegar, con lo aprendido). Nada de waterfall.

## Fases
| Fase | Feature | Criterio de done de la fase (medible) | Estado |
|---|---|---|---|
| 0 | F0 Spike fuentes de datos | `specs/decisions/data-sources.md` con veredicto por juego y `pnpm --dir spike start` genera `spike/report.json` con 6 juegos | PASS |
| 1 | F1 Fundación | CI verde en un PR: typecheck, lint, jest, `supabase test db`, Maestro "login → home" | **ACTUAL** |
| 2 | F2 Catálogo | Para cada juego con fuente asignada en `decisions/data-sources.md` (incluidas TEMPORAL): ingesta idempotente + búsqueda e2e Maestro | pendiente |
| 3 | F3 Colección | Maestro: añadir carta → aparece en carpeta con estado y cantidad; pgTAP: otro usuario no la ve | pendiente |
| 3b | F4b Spike eBay (ADR-002) | `spike/ebay` genera report con: acceso Browse/Insights, % de anuncios emparejados a la printing correcta en 50 muestras por juego, cuota de llamadas estimada; veredicto en ADR-002 | pendiente |
| 4 | F4 Precios | Valor total de colección = suma verificada por test SQL; gráfico de historial renderiza (screenshot Maestro) | pendiente |
| 5 | F5 Perfil | Maestro: personalizar tema+banner+vitrina → perfil público por deep link muestra los cambios en sesión anónima | pendiente |
| — | v2 (fuera de MVP) | Feed social, escáner, intercambio | sin spec |

Precios: F4 se construye sobre las fuentes TEMPORALES; si F4b da PASS, el adapter eBay sustituye al precio temporal sin cambiar la app (PRC-10..14).
F2 se puede partir en sub-fases por juego (F2.mtg, F2.pokemon…) si F0 lo aconseja.

## Registro
Formato: `AAAA-MM-DD · Fase · Veredicto · Evidencia (comando/archivo) · Nota`
- 2026-10-11 · Specs · UNDECIDABLE_UNDER(revisión de Vik de 00-constitution, 01-product y requirements F0–F5) · specs/ · Spec pack inicial
- 2026-10-11 · Specs · PASS · aprobación de Vik en chat ("luz verde a todo") · Incluye deps extra de spike: typescript, @types/node; pnpm vía `npx pnpm@10`
- 2026-10-11 · F0 · PASS · verifier (DS-01..08 PASS) + `pnpm --dir spike start` → report.json 6 games · Por juego: mtg PASS, lorcana PASS (solo USD), pokemon/yugioh/onepiece UNDECIDABLE_UNDER(términos), riftbound FAIL. Ver specs/decisions/data-sources.md
- 2026-10-11 · Decisión · PASS · Vik en chat · Fuentes de F0 se usan como TEMPORALES (decisions/data-sources.md); F2 desbloqueado. Precio objetivo = eBay por idioma, últimas 10 ofertas + 10 ventas (ADR-002, pendiente de spike F4b)
- 2026-10-11 · F1 spec · PASS · aprobación de Vik en chat ("continua") de specs/features/F1-foundation/design.md + tasks.md · Incluye deps, extensión citext y Actions de terceros listadas en design.md
