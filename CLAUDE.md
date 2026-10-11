# CLAUDE.md — App TCG (nombre provisional)

App móvil para coleccionistas de cartas TCG: **colección + precios + perfil personalizable**, gratis lo que otros cobran.
- Producto (qué y por qué): `specs/01-product.md`
- Arquitectura (cómo): `specs/03-architecture.md`
- Fase actual y registro de veredictos: `specs/02-roadmap.md`  ← léelo SIEMPRE al empezar

## Flujo spec-driven (obligatorio)
1. Abre la feature de la fase actual: `specs/features/<ID>/requirements.md` → `design.md` → `tasks.md`.
2. Ejecuta **una sola tarea** de `tasks.md` cada vez. Cada tarea declara `Done =` (comando + resultado esperado).
3. Ciclo por tarea: **spec → generate → gate → score → record**
   - **gate** (¿forma correcta?): `pnpm typecheck && pnpm lint`
   - **score** (señal externa): el comando de `Done =` (jest, `supabase test db`, maestro, script). Nunca tu opinión sobre tu propio código.
   - **record**: marca `[x]` en `tasks.md` y pega la última línea del output del score.
4. Veredicto de cada tarea y fase: `PASS` / `FAIL` / `UNDECIDABLE_UNDER(<S>)`, donde S nombra exactamente qué falta para decidir (dato, acceso, decisión de Vik). Nunca "no sé".
5. Una fase no empieza hasta que la anterior tiene veredicto en `specs/02-roadmap.md#registro`.

## Comandos (existen a partir de F1)
| Qué | Comando |
|---|---|
| Instalar | `pnpm install` |
| App | `pnpm --filter mobile start` |
| Gate | `pnpm typecheck && pnpm lint` |
| Unit tests | `pnpm test` |
| DB local | `supabase start` / `supabase db reset` |
| Tests RLS/SQL | `supabase test db` |
| E2E | `pnpm e2e` (Maestro, `apps/mobile/e2e/`) |
| Tipos DB | `pnpm gen:types` |

## Always Do
- Leer `requirements.md` de la feature antes de tocar código; citar el ID del requisito (p.ej. `COL-03`) en el commit.
- Escribir el test que prueba el criterio de aceptación antes de dar la tarea por cerrada.
- Toda tabla nueva = migración en `supabase/migrations/` + RLS activado + test pgTAP de sus políticas en `supabase/tests/`.
- Ejecutar `pnpm gen:types` tras cada migración y commitear los tipos.
- Dinero: entero en **céntimos** + código ISO de moneda (`EUR`, `USD`). Nunca `float`.
- Código e identificadores en inglés; textos de UI por i18n (`es`, `en`), nunca hardcodeados.
- Acceso a datos de terceros solo dentro de `packages/catalog-adapters/<game>/` o `supabase/functions/`. La app solo habla con Supabase.
- Parar y ejecutar gate+score tras tocar 3 archivos.
- Las fuentes marcadas TEMPORAL en `specs/decisions/data-sources.md` solo se usan dentro de su adapter, para poder cambiarlas por eBay (ADR-002) sin tocar la app.
- Resumen final de cada tarea: archivos tocados, comando score + resultado, dead code detectado (sin borrarlo).

## Ask First
- Añadir una dependencia (npm, Expo plugin, extensión Postgres).
- Cambio no aditivo de esquema (renombrar/borrar columna, cambiar tipo).
- Añadir o cambiar una fuente de datos externa (revisar términos de uso primero).
- Cualquier trabajo fuera de la tarea actual, aunque parezca una mejora obvia.
- Editar cualquier `requirements.md` o `specs/00-constitution.md` (los aprueba Vik).

## Never Do
- Nunca `service_role` key ni secretos en la app, en `EXPO_PUBLIC_*` o en git.
- Nunca desactivar RLS ni `using (true)` en tablas con datos de usuario.
- Nunca scrapear HTML de webs (TCGplayer, Cardmarket, eBay incluido "vendidos"). Solo APIs oficiales o ficheros publicados para descarga.
- Nunca marcar `[x]` sin el output del comando score.
- Nunca borrar código muerto por iniciativa propia: se menciona en el resumen.
- Nunca poner una función detrás de paywall o límite artificial (ver constitución P1).
- Nunca añadir abstracciones, flags de config o manejo de errores para casos que no pueden ocurrir y nadie pidió.
- Nunca avanzar de fase sin veredicto registrado.

## Verificación
- Al cerrar una feature: `/go` (e2e + simplify + PR). La revisión contra requisitos la hace el subagente `verifier` (`.claude/agents/verifier.md`), no el autor.
- Si no hay subagente disponible y verifica la misma sesión: etiquetar el informe como **auto-inducido**.

## Registro de correcciones
> Si Vik corrige lo mismo dos veces, se convierte en regla en la sección que toque y se anota aquí con fecha.
- (vacío)
