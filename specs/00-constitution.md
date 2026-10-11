# Constitución del proyecto

Principios no negociables. Si un spec o una tarea los contradice, gana la constitución y se marca `UNDECIDABLE_UNDER(conflicto con Pn)`.
Solo Vik puede cambiar este documento.

## Producto
- **P1 — Gratis lo esencial.** Todo lo que la competencia (Collectr y similares) cobra en su plan de pago y forme parte del MVP es gratis aquí: carpetas/portfolios ilimitados, historial de precios completo, exportación de la colección, valoración por estado/graded. Sin límites artificiales de cartas o colecciones.
- **P2 — El perfil es del usuario.** El perfil es una vitrina personalizable (tema, banner, vitrina de cartas, orden de secciones). La personalización es la diferencia frente a la competencia, no un extra.
- **P3 — Multi-TCG desde el modelo de datos.** Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound comparten el mismo modelo. Añadir un juego = añadir un adapter, no cambiar el esquema.
- **P4 — Euro primero.** Usuario objetivo inicial: España/UE. Precio en EUR (Cardmarket) por defecto y USD (TCGplayer) como alternativa. Siempre se muestra la fuente y la fecha del precio.
- **P5 — Honestidad de datos.** Si no hay precio, se muestra "sin precio", nunca 0 ni un precio inventado o interpolado.

## Ingeniería
- **E1 — Fases pequeñas con veredicto.** Cada fase cabe en un prompt, tiene criterio de done medible y termina en PASS / FAIL / UNDECIDABLE_UNDER(S).
- **E2 — Señal externa.** Done = test, screenshot o respuesta de API. Nunca la autoevaluación del modelo.
- **E3 — Seguridad por defecto.** RLS en todas las tablas; datos de usuario privados salvo que el usuario los haga públicos.
- **E4 — Simplicidad.** Sin abstracciones no pedidas. Si 200 líneas podían ser 50, se rehace.
- **E5 — Datos de terceros legales.** Solo fuentes con API o descarga pública y términos que permitan el uso. Se documenta cada fuente en `specs/decisions/`.
