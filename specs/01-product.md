# Producto

## Visión
Collectr + Instagram para coleccionistas de TCG: llevar la colección y su valor, y enseñarla con un perfil que se siente propio. Lo que otros cobran, aquí es gratis (constitución P1).

## Problema (hipótesis a validar)
| Hipótesis | Cómo se valida |
|---|---|
| H1. Los perfiles de las apps de colección son genéricos; el coleccionista quiere "presumir" su colección. | 5 entrevistas / encuesta en comunidades ES de TCG; ≥3 de 5 lo mencionan sin sugerirlo. |
| H2. Funciones clave (portfolios ilimitados, historial de precios, export) están tras paywall en la competencia. | Tabla comparativa con capturas de los planes actuales de Collectr (tarea F0-T9). |
| H3. El coleccionista español quiere precio de Cardmarket en EUR, no TCGplayer en USD. | Mismas entrevistas. |

## Usuario objetivo
Coleccionista (no necesariamente jugador) de 16–40 años en España/UE que tiene cartas de 1+ juegos, compra en Cardmarket y comparte su colección en redes.

## Alcance MVP (v1)
| ID | Feature | Spec |
|---|---|---|
| F0 | Spike de fuentes de datos (catálogo + precios de los 6 juegos) | `features/F0-data-sources-spike/` |
| F1 | Fundación: monorepo, Expo, Supabase, auth, CI | `features/F1-foundation/` |
| F2 | Catálogo multi-TCG + búsqueda | `features/F2-catalog/` |
| F3 | Colección: carpetas, añadir/editar cartas, estado, graded | `features/F3-collection/` |
| F4 | Precios: valor de colección, historial, EUR/USD | `features/F4-pricing/` |
| F5 | Perfil personalizable + perfil público | `features/F5-profile/` |

Juegos: Pokémon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, Disney Lorcana, Riftbound. Orden de incorporación según resultados de F0.

## Fuera del MVP (no construir aún)
Feed social (posts, likes, comentarios, seguir, stories) · escáner por cámara · marketplace/intercambios · producto sellado · notificaciones de precio · web app.
Se diseña el modelo de datos para que el feed social (v2) encaje sin migraciones destructivas, pero no se implementa nada.

## Métricas de éxito del MVP
- Un usuario nuevo añade su primera carta en < 60 s desde el registro (medido con Maestro + timestamp).
- Valor total de colección visible con precio de ≤ 48 h de antigüedad para ≥ 90 % de las cartas con precio disponible en la fuente.
- Perfil público compartible por URL/deep link.
