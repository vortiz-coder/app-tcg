---
description: Escribe design.md y tasks.md de una feature a partir de su requirements.md aprobado
argument-hint: <ID de feature, p.ej. F1>
---
Feature: $ARGUMENTS
1. Lee `specs/00-constitution.md`, `specs/03-architecture.md`, `specs/decisions/*` y `specs/features/$ARGUMENTS*/requirements.md`.
2. Si algún requisito es ambiguo, lista las interpretaciones posibles y PARA para que Vik elija. No elijas en silencio.
3. Escribe `design.md` con `specs/templates/design.md`. Solo lo necesario para cumplir los requisitos.
4. Escribe `tasks.md` con `specs/templates/tasks.md`: cada tarea ≤ 3 archivos, cita IDs de requisito y tiene `Done =` con comando ejecutable. Todos los IDs de requisitos deben aparecer en alguna tarea; la última tarea es siempre la verificación con el subagente `verifier`.
5. Marca la feature como **ACTUAL** en `specs/02-roadmap.md` solo si la fase anterior tiene veredicto PASS en el registro.
6. Para y pide aprobación a Vik. No escribas código.
