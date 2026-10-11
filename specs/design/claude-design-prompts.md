# Prompts para Claude Design

Regla (Vik, 2026-10-11): el código se ciñe a los specs; **todo lo visual** (layout, color, tipografía, componentes, estados) se encarga a Claude Design con estos prompts. El código implementa lo que devuelva Claude Design; hasta entonces las pantallas usan estilos provisionales mínimos.

Cómo usarlo:
- Lanza primero el **P0**: fija el sistema de diseño. Todos los demás lo dan por hecho.
- Después, un prompt por sesión, en el orden de las fases (F1 → F5). Cada prompt cita los IDs de requisito que cubre.
- Guarda el resultado en `Claude outputs/` (p. ej. `p01-login.html`) y enlázalo en el `design.md` de su feature.
- Base existente: `Claude outputs/vitrina-preview.html` (tokens, Button, Chip, Badge, Price, CardTile, ValueSummary, ProfileHeader; pantallas Inicio, Ficha de carta y Perfil público).

Cada prompt incluye ya el contexto común de producto: se copia y pega tal cual.

---

## P0 · Sistema de diseño (base de todo)
```
Consolida el sistema de diseño de la app a partir de la vista preliminar existente (vitrina-preview.html: tokens de color claro/oscuro, espaciado 4-48, radios, fuente Geist; componentes Button, Chip, Badge, Price, CardTile, ValueSummary, ProfileHeader).

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

Entrega:
1. Tokens finales (color claro/oscuro, espaciado, radios, tipografía con escala nombrada, sombras), con contraste WCAG AA comprobado para texto y para precios al alza y a la baja.
2. Componentes que faltan para el MVP, con sus estados (default, pressed, disabled, focus, loading, error):
   TextInput, OtpInput (6 dígitos), TabBar (3 tabs), SegmentedControl (rangos 7d/30d/90d/1a/todo), BottomSheet, ListRow, EmptyState, ErrorBanner, Toast, Avatar, Skeleton, Stepper de cantidad, Select de estado (NM/LP/MP/HP/DMG), DragHandle.
3. Reglas de dinero: formato es-ES ("1.234,56 €") y en-US ("$1,234.56"), cifras tabulares, cómo se muestran la fuente y la fecha ("Cardmarket · 11 oct"), el estado "Sin precio" y la etiqueta "precio raw".
4. Iconografía: un solo set y su lista de iconos para las 3 tabs y las acciones (añadir, buscar, filtro, ordenar, exportar, compartir, editar, borrar, mover, arrastrar).
Quita del sistema todo lo que pertenezca a v2 (stories, feed). Ningún componente de paywall.
```

---

## F1 — Fundación

### P1 · Login (FND-03)
```
Diseña el flujo de acceso.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

Requisitos:
- Paso 1: email → botón "Enviar código". Paso 2: campo de código de 6 dígitos → "Verificar", con opción "Cambiar email". No hay contraseña.
- Alternativas: "Continuar con Google" y "Continuar con Apple" (Apple solo en iOS; respeta las guías de marca de Apple y de Google para sus botones).
- Un email nuevo crea la cuenta: no hay pantalla de registro separada.
- Estados: enviando, código enviado, código incorrecto o caducado, email no válido, sin conexión, error genérico.
- Accesibilidad: teclado de email en el paso 1 y numérico con autocompletado de código (one-time-code) en el paso 2.
Entrega las dos pantallas en claro y oscuro, el copy es/en de cada texto y error, y los componentes del P0 que uses.
```

### P2 · Navegación y pantallas vacías (FND-07)
```
Diseña la estructura de navegación principal: TabBar con 3 tabs, Colección (inicial), Buscar y Perfil.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

En F1 las tres pantallas están vacías. Diseña su estado vacío con un mensaje y una llamada a la acción que anticipe la feature futura:
- Colección vacía → "Añade tu primera carta" (lleva a Buscar).
- Buscar sin consulta → sugerencia de juegos.
- Perfil recién creado → username autogenerado tipo "user_k3f9x2qa", con invitación a personalizarlo, y botón "Cerrar sesión".
Objetivo de producto: un usuario nuevo añade su primera carta en menos de 60 s desde el registro; el estado vacío de Colección debe empujar a eso.
Entrega las 3 pantallas en claro y oscuro, el copy es/en y los iconos de las tabs.
```

---

## F2 — Catálogo

### P3 · Búsqueda (CAT-04, CAT-05)
```
Diseña la pantalla Buscar del catálogo multi-TCG.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

Requisitos:
- Búsqueda por nombre, tolerante a acentos y mayúsculas, con resultados a medida que se escribe (la primera página tarda menos de 500 ms).
- Filtros por juego (6 juegos) y por set del juego elegido.
- Resultados: lista o rejilla de cartas con imagen, nombre, set, número y rareza. Las cartas tienen proporción 63:88.
- Estados: sin consulta, cargando (skeleton), sin resultados, error de red, juego todavía no disponible (no todos los juegos entran a la vez).
- Desde cada resultado se puede añadir a la colección en ≤ 3 toques (ver P7): prevé el punto de entrada.
Entrega la pantalla con los filtros abiertos y cerrados, los estados, y el copy es/en.
```

### P4 · Detalle de carta (CAT-06, PRC-03, PRC-08)
```
Revisa la "Ficha de carta" de vitrina-preview.html y ajústala a estos requisitos.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Imagen grande, set, número, rareza y printings disponibles (acabado normal, foil, reverse…; idioma).
- Precio de mercado en la moneda preferida, con fuente y fecha visibles. "Sin precio" si falta.
- Si la carta es gradeada: precio de la printing sin gradear con la etiqueta "precio raw".
- Acción principal: "Añadir a la colección" (abre P7). Muestra cuántas copias tiene ya el usuario, si tiene alguna.
- Hueco reservado para el gráfico de historial (P10).
Entrega la ficha con precio, sin precio, gradeada y con varias printings, en claro y oscuro, y el copy es/en.
```

---

## F3 — Colección

### P5 · Carpetas (COL-01, COL-02, COL-08)
```
Diseña la gestión de carpetas de la tab Colección.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Siempre existe una carpeta por defecto, "Mi colección". No hay límite de carpetas (prevé 100 o más).
- Acciones: crear, renombrar, reordenar (arrastrando), borrar (con confirmación) y marcar como pública o privada (privada por defecto).
- Cada carpeta muestra el nº de cartas y su valor (o "Sin precio" con el nº de cartas excluidas).
- "Exportar a CSV" de toda la colección: gratis y visible.
Entrega la lista de carpetas, el modo reordenar, los diálogos de crear, renombrar y borrar, en claro y oscuro, y el copy es/en.
```

### P6 · Contenido de carpeta (COL-05, COL-09, PRC-04, PRC-07)
```
Diseña el interior de una carpeta.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Lista o rejilla de ítems con imagen, nombre, set, cantidad, estado (NM/LP/MP/HP/DMG), idioma, gradeo si lo tiene, y precio o "Sin precio".
- Ordenar por nombre, fecha de alta, set o valor. Filtrar por juego.
- Cabecera con el valor total de la carpeta, que indica cuántos ítems quedan excluidos por no tener precio.
- Ganancia o pérdida frente al precio de compra, solo si el usuario lo indicó y la moneda coincide.
- Acciones por ítem: editar, mover a otra carpeta, borrar. Selección múltiple para mover o borrar.
Entrega la carpeta llena, vacía, con ítems sin precio y en selección múltiple, en claro y oscuro, y el copy es/en.
```

### P7 · Añadir carta (COL-03, COL-04)
```
Diseña el flujo "Añadir a la colección" como BottomSheet, lanzado desde Buscar o desde el detalle.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Debe completarse en ≤ 3 toques con los valores por defecto: cantidad 1, estado NM, carpeta por defecto e idioma de la printing.
- Campos obligatorios visibles: printing, cantidad (≥ 1), estado, idioma, carpeta.
- "Más detalles" (plegado): gradeo (empresa + nota, p. ej. PSA 10), precio de compra + moneda, fecha de compra y notas.
- Confirmación tras añadir (toast con "Ver en carpeta" y "Deshacer").
Entrega el sheet plegado y desplegado, el estado de error de validación y el toast, en claro y oscuro, y el copy es/en.
```

---

## F4 — Precios

### P8 · Valor de colección e historial (PRC-05, PRC-06)
```
Diseña la vista de valor de la colección y el gráfico de historial (se reutiliza en el detalle de carta).

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Valor total global y por carpeta, en la moneda preferida, con fuente y fecha. Indica cuántas cartas quedan excluidas por no tener precio.
- Gráfico de historial con rangos 7d / 30d / 90d / 1a / todo. **Todo el historial es gratis**: nada bloqueado.
- Variación del rango seleccionado (importe y %), con color al alza o a la baja accesible (no depender solo del color).
- Interacción: tocar o arrastrar sobre el gráfico muestra el valor y la fecha de ese punto.
- Estados: menos de 2 días de datos, sin precio, cargando.
- Selector de moneda EUR/USD. Sin conversión: si una carta no tiene fuente en esa moneda, muestra "Sin precio".
Entrega la vista con 365 días de datos y los estados, en claro y oscuro, y el copy es/en.
```

### P9 · Precio de mercado eBay (PRC-12, PRC-13, PRC-14) — solo si F4b da PASS
```
Diseña cómo se muestra el precio basado en eBay en la ficha de carta.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Dos cifras separadas: "Precio de referencia" (mediana de las últimas 10 ventas) y "Precio de oferta" (mediana de las 10 ofertas activas, con envío). Separadas por idioma de la carta y por raw o graded.
- Con menos de 3 ventas: el aviso "pocas ventas" sustituye al precio de referencia, y el de oferta se sigue mostrando etiquetado como tal.
- Enlace "Ver las 20 observaciones": lista con precio, fecha, tipo (venta u oferta) y enlace al anuncio.
Entrega el bloque de precio en sus 3 estados y la lista de observaciones, en claro y oscuro, y el copy es/en.
```

---

## F5 — Perfil

### P10 · Editor de perfil (PRF-01)
```
Diseña la edición de los datos del perfil.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Username único (valida la disponibilidad mientras se escribe; formato a-z, 0-9 y _, de 3 a 30 caracteres), nombre visible, bio (≤ 280 caracteres, con contador), avatar y banner (subida de imagen ≤ 5 MB con recorte; proporciones: avatar círculo y banner la del ProfileHeader).
- Interruptor "Perfil público" (privado por defecto), con una explicación clara de qué se ve.
- Estados: username ocupado o no válido, imagen demasiado grande, subiendo, guardado.
Entrega el editor, el recortador de imagen y los estados, en claro y oscuro, y el copy es/en.
```

### P11 · Editor de tema (PRF-02, PRF-08)
```
Diseña el editor de tema del perfil: es la diferencia frente a la competencia y debe sentirse expresivo.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Color de acento: presets y un selector libre.
- Fondo: color, degradado o imagen.
- Estilo de tarjeta para la vitrina: al menos 3 estilos (p. ej. limpio, con marco, foil).
- Vista previa en vivo del perfil mientras se edita, y "Restablecer".
- El tema solo afecta al perfil (al propio y a cómo lo ven otros), no al resto de la app.
- Garantiza la legibilidad con cualquier combinación (contraste mínimo del texto sobre el fondo elegido, con ajuste automático o aviso).
- Todo gratis: ningún preset bloqueado.
Entrega el editor con 6 presets, la vista previa en vivo y un caso de contraste corregido, en claro y oscuro, y el copy es/en.
```

### P12 · Vitrina y secciones (PRF-03, PRF-04, PRF-05)
```
Diseña la edición de la vitrina y el orden de las secciones del perfil.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Vitrina: el usuario elige hasta 12 cartas de su colección y las ordena arrastrando. Muestra el contador "n/12" e impide elegir una 13ª con un mensaje claro.
- Secciones del perfil: vitrina, estadísticas (valor total, nº de cartas, juegos) y carpetas públicas. Se pueden reordenar arrastrando y ocultar.
- Interruptor "Ocultar el valor monetario en mi perfil público".
Entrega el selector de cartas, la vitrina en modo ordenar y la lista de secciones, en claro y oscuro, y el copy es/en.
```

### P13 · Perfil público (PRF-06, PRF-07)
```
Revisa el "Perfil público" de vitrina-preview.html y ajústalo al MVP.

App móvil (iOS + Android, Expo/React Native) para coleccionistas de cartas TCG: Pokémon, Magic, Yu-Gi-Oh!, One Piece, Lorcana y Riftbound. Usuario: coleccionista de 16–40 años en España/UE que compra en Cardmarket y comparte su colección en redes. Tres pilares: colección, precios y un perfil personalizable que sirve de vitrina. Lo que la competencia (Collectr) cobra aquí es gratis: **ningún elemento de paywall, candado, "PRO" ni upsell**. Precio en EUR por defecto y USD como alternativa, **siempre con fuente y fecha visibles**. Si no hay precio se muestra **"Sin precio"**, nunca 0 ni un precio estimado. Textos en español (por defecto) e inglés: entrega el copy en los dos idiomas y prevé que en inglés o en alemán la cadena puede ser un 30 % más larga. Teléfono de referencia: 375 × 812 pt, tema claro y oscuro. Fuera del MVP (no diseñar): feed social, likes, comentarios, seguidores, stories, escáner por cámara, marketplace e intercambios.

- Se abre sin login por enlace (app://u/<username> o URL universal). Muestra banner, avatar, nombre, bio, el tema elegido, la vitrina y las secciones en el orden que eligió el usuario.
- Si el dueño oculta el valor, no aparece ninguna cifra monetaria.
- Sin elementos sociales de v2: quita del preview las stories, el feed, los likes y los seguidores. Acción "Compartir perfil".
- Estados: perfil privado ("Este perfil es privado"), username inexistente, cargando.
- Visto sin sesión: una invitación discreta a crear su propia colección, sin bloquear el contenido.
Entrega el perfil con dos temas distintos (uno claro y uno oscuro), el valor oculto y los estados, y el copy es/en.
```
