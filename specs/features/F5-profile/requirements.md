# F5 — Perfil personalizable · Requisitos
**Goal:** que el perfil sea la vitrina del coleccionista y la razón para elegir esta app (P2). Base del futuro social (v2).

| ID | Requisito | Aceptación |
|---|---|---|
| PRF-01 | El usuario SHALL poder editar username (único), nombre visible, bio (≤ 280), avatar y banner (imagen subida a Storage, ≤ 5 MB, recortada). | Maestro + pgTAP unicidad. |
| PRF-02 | El usuario SHALL poder elegir un tema: color de acento, fondo (color, degradado o imagen) y estilo de tarjeta, de un set de presets y un selector libre. | Maestro: cambiar tema → screenshot coincide. |
| PRF-03 | El usuario SHALL poder elegir hasta 12 cartas de su colección como **vitrina** y ordenarlas por arrastre. | Maestro + pgTAP (13ª falla). |
| PRF-04 | El usuario SHALL poder reordenar y ocultar secciones del perfil: vitrina, estadísticas (valor total, nº cartas, juegos), carpetas públicas. | Maestro. |
| PRF-05 | El usuario SHALL poder ocultar el valor monetario en su perfil público aunque el perfil sea público. | pgTAP con `anon`: el valor no se devuelve si está oculto. |
| PRF-06 | WHEN `is_public = true`, el perfil SHALL ser accesible sin login por deep link `app://u/<username>` y URL universal. | Maestro en sesión anónima abre el link y ve tema+banner+vitrina. |
| PRF-07 | WHEN `is_public = false`, el perfil SHALL devolver "perfil privado" a otros usuarios y `anon`. | pgTAP. |
| PRF-08 | Toda la personalización SHALL ser gratuita (P1). | Revisión verifier: no hay flags de pago. |
| PRF-09 | Los datos de tema y secciones SHALL validarse en servidor (esquema JSON) para evitar contenido arbitrario. | pgTAP: insertar `theme` inválido falla. |
