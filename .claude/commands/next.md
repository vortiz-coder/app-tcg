---
description: Ejecuta la siguiente tarea pendiente de la fase actual (un ciclo spec→generate→gate→score→record)
---
1. Lee `CLAUDE.md` y `specs/02-roadmap.md`; identifica la fase **ACTUAL**.
2. En `specs/features/<feature actual>/tasks.md` toma la primera tarea `[ ]`. Si no hay `design.md`/`tasks.md`, para y di: "ejecuta /spec <ID> primero".
3. Lee los requisitos que cita la tarea en `requirements.md`.
4. Implementa solo esa tarea. Cambios quirúrgicos.
5. Gate: `pnpm typecheck && pnpm lint` (en F0: `pnpm --dir spike exec tsc --noEmit`).
6. Score: ejecuta exactamente el comando de `Done =`.
7. Record: si PASS, marca `[x]` y añade debajo `  ↳ <fecha> PASS: <última línea del output>`. Si FAIL, deja `[ ]` y anota la causa. Si no puedes decidir: `UNDECIDABLE_UNDER(<S concreta>)`.
8. Responde con: tarea, veredicto, archivos tocados, comando+output, dead code visto. Para. No empieces la siguiente.
$ARGUMENTS
