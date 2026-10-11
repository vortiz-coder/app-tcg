---
description: Cierre de feature — e2e completo, simplify, verificación independiente y PR
---
1. Ejecuta todo: `pnpm typecheck && pnpm lint && pnpm test && supabase test db && pnpm e2e`. Si algo falla → FAIL, informa y para.
2. Simplify: revisa el diff de la rama (`git diff main...HEAD`). Lista funciones/archivos que podrían ser mucho más cortos, abstracciones no pedidas y código muerto. Aplica solo simplificaciones que no cambien comportamiento y vuelve a ejecutar el paso 1. El código muerto se lista, no se borra.
3. Lanza el subagente `verifier` con la ruta de la feature. Si no puedes lanzarlo, haz tú la verificación y etiqueta el informe "auto-inducido".
4. Si el verifier da PASS en todos los requisitos: crea rama/commit si falta y abre PR con `gh pr create`, cuerpo = tabla del verifier + comandos ejecutados.
5. Añade la línea al registro de `specs/02-roadmap.md` con el veredicto de la fase y el enlace al PR.
