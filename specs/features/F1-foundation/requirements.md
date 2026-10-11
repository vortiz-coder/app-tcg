# F1 — Fundación · Requisitos
**Goal:** esqueleto que compila, se testea y despliega, con login, para que cada feature posterior solo añada código de negocio.
`design.md` y `tasks.md` se escriben al empezar la fase (`/spec F1`).

| ID | Requisito | Aceptación |
|---|---|---|
| FND-01 | El repo SHALL ser un monorepo pnpm con `apps/mobile`, `packages/shared`, `supabase/` según `03-architecture.md`. | `pnpm install && pnpm typecheck` exit 0. |
| FND-02 | La app SHALL arrancar en iOS y Android (Expo) con TypeScript estricto. | `pnpm --filter mobile exec expo export` exit 0. |
| FND-03 | El usuario SHALL poder registrarse e iniciar sesión con email (código OTP) y con Google y Apple. | Maestro `e2e/auth.yaml`: OTP contra Supabase local (Inbucket) → ve Home. Google/Apple: probado manualmente, captura en PR. |
| FND-04 | WHEN un usuario se registra el sistema SHALL crear su fila en `profiles` con `username` único autogenerado editable. | pgTAP: insertar en `auth.users` crea `profiles`; username único. |
| FND-05 | La app SHALL tener i18n `es` (por defecto) y `en`. | Jest: no hay strings de UI fuera de los ficheros de traducción (lint rule). |
| FND-06 | CI SHALL ejecutar en cada PR: typecheck, lint, jest, `supabase test db`, Maestro (Android emulador). | Un PR de prueba con check verde. |
| FND-07 | La navegación SHALL tener 3 tabs: Colección, Buscar, Perfil (pantallas vacías). | Maestro navega las 3 tabs. |
| FND-08 | Los secretos SHALL vivir solo en env de CI/Supabase; la app solo usa `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`. | `git grep -i service_role -- apps/` vacío. |
