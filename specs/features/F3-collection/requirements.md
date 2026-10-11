# F3 — Colección · Requisitos
**Goal:** registrar lo que tengo, con el detalle que importa al coleccionista, sin límites (P1).

| ID | Requisito | Aceptación |
|---|---|---|
| COL-01 | Al registrarse, el usuario SHALL tener una carpeta por defecto "Mi colección". | pgTAP. |
| COL-02 | El usuario SHALL poder crear, renombrar, reordenar y borrar carpetas, sin límite de número. | Maestro + pgTAP (crear 100 carpetas no falla). |
| COL-03 | El usuario SHALL poder añadir una printing a una carpeta indicando cantidad (≥1), estado (NM/LP/MP/HP/DMG) e idioma; opcional: gradeo (empresa + nota), precio de compra + moneda, fecha, notas. | Maestro `add-card.yaml`: buscar → añadir → aparece en carpeta con cantidad y estado. |
| COL-04 | El flujo "añadir carta" desde la búsqueda SHALL requerir ≤ 3 toques con valores por defecto (cantidad 1, NM, carpeta por defecto). | Maestro cuenta los taps. |
| COL-05 | El usuario SHALL poder editar y borrar ítems, y mover ítems entre carpetas. | Maestro. |
| COL-06 | Los ítems y carpetas SHALL ser privados por defecto; solo el dueño lee/escribe. | pgTAP: usuario B no puede leer ni escribir ítems de A. |
| COL-07 | WHEN la carpeta tiene `visibility='public'` y el perfil `is_public`, cualquiera SHALL poder leerla. | pgTAP con rol `anon`. |
| COL-08 | El usuario SHALL poder exportar su colección a CSV (gratis, P1). | Jest: el CSV de un fixture coincide con snapshot. |
| COL-09 | La lista de colección SHALL ordenarse por nombre, fecha de alta, set o valor, y filtrarse por juego. | Maestro. |
