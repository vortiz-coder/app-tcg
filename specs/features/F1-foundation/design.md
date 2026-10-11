# F1 — Diseño

Elecciones de Vik (2026-10-11): e2e Maestro en GitHub Actions con emulador Android · FND-05 = regla ESLint + test Jest que la ejecuta · Google/Apple se implementan ya, credenciales las aporta Vik · username autogenerado `user_` + 8 caracteres.

## Diseño visual
Lo visual (layout, color, tipografía, componentes, estados) lo define Claude Design: prompts **P0** (sistema de diseño), **P1** (login) y **P2** (navegación y pantallas vacías) en `specs/design/claude-design-prompts.md`. Hasta tener su resultado, las pantallas de F1 usan estilos provisionales mínimos (solo layout).

| Prompt | Resultado | Estado |
|---|---|---|
| P0 · Sistema de diseño | [`Claude outputs/p00-design-system.html`](../../../Claude%20outputs/p00-design-system.html) · design system "Vitrina" en claude.ai (tokens, README, componentes) | Entregado 2026-10-11, pendiente de revisión de Vik |
| P1 · Login (FND-03) | — | pendiente |
| P2 · Navegación y pantallas vacías (FND-07) | — | pendiente |

## Estructura (solo lo que pide F1)
```
package.json              scripts raíz: typecheck, lint, test, e2e, gen:types · devDeps: typescript, eslint, supabase (CLI)
pnpm-workspace.yaml       apps/*, packages/*
tsconfig.base.json        strict: true, noUncheckedIndexedAccess
eslint.config.js          typescript-eslint + eslint-config-expo + i18next/no-literal-string (solo apps/mobile/app y src)
.env.example              EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY (nada más)
apps/mobile/              Expo SDK 57 + Expo Router
  app.config.ts           scheme "apptcg" (deep links), lee EXPO_PUBLIC_*; en build E2E permite HTTP claro (Supabase local)
  app/_layout.tsx         providers (QueryClient, i18n, sesión) + redirección según sesión
  app/(auth)/sign-in.tsx  email → código OTP → verificar; botones Google y Apple (Apple solo iOS)
  app/(tabs)/_layout.tsx  3 tabs: collection (inicial = "Home"), search, profile
  app/(tabs)/{collection,search,profile}.tsx   pantallas vacías con título traducido
  src/lib/supabase.ts     createClient con AsyncStorage; solo anon key
  src/lib/auth.tsx        SessionProvider (onAuthStateChange) + hook useSession
  src/lib/oauth.ts        Google: signInWithOAuth + WebBrowser.openAuthSessionAsync · Apple: expo-apple-authentication + signInWithIdToken
  src/i18n/               i18next + expo-localization; locales/es.json (por defecto), en.json
  __tests__/no-literal-strings.test.ts   ejecuta ESLint (API) sobre app/ y src/ → 0 errores i18next
  e2e/auth.yaml, e2e/tabs.yaml, e2e/scripts/get-otp.js (lee el código de Mailpit/Inbucket local)
packages/shared/src/      database.ts (generado por `pnpm gen:types`), index.ts
supabase/config.toml      auth: email OTP (6 dígitos), Google y Apple con secretos `env(...)`
supabase/templates/       plantilla de email con {{ .Token }}
supabase/migrations/      <ts>_profiles.sql
supabase/tests/           profiles.test.sql (pgTAP)
.github/workflows/ci.yml
```
`packages/catalog-adapters` y `packages/ingest` no se crean en F1 (son de F2).

## Cambios de datos (migraciones, RLS)
Migración `profiles` (columnas de `03-architecture.md`, completas para no migrar en F5):
- `create extension if not exists citext` (extensión Postgres: aprobada al aprobar este spec).
- `profiles(id uuid pk references auth.users on delete cascade, username citext unique not null check (username ~ '^[a-z0-9_]{3,30}$'), display_name, bio, avatar_path, banner_path, theme jsonb default '{}', sections jsonb default '[]', preferred_currency text default 'EUR' check in ('EUR','USD'), is_public bool default false, created_at)`.
- Función `handle_new_user()` `security definer`, trigger `after insert on auth.users`: inserta `profiles` con `username = 'user_' || 8 chars [a-z0-9]` aleatorios; reintenta si colisiona (`unique_violation`).
- RLS activado. Políticas:
  - `select`: `id = auth.uid() or is_public`.
  - `update`: `id = auth.uid()` (username editable por el dueño; el check y el unique lo validan).
  - Sin política `insert`/`delete` para clientes: solo el trigger crea filas; el borrado va en cascada desde `auth.users`.
- pgTAP: (1) insertar en `auth.users` crea 1 fila en `profiles` con username `^user_[a-z0-9]{8}$`; (2) dos usuarios → usernames distintos; (3) `update` a un username ya usado → error unique; (4) usuario B no ve el perfil privado de A y sí lo ve si `is_public`; (5) usuario B no puede actualizar el perfil de A; (6) RLS activado en `profiles`.

## Pantallas / rutas
| Ruta | Contenido | Req |
|---|---|---|
| `/(auth)/sign-in` | Email → "Enviar código" → campo código → "Verificar". Botones Google / Apple. | FND-03 |
| `/(tabs)/collection` | Vacía, título "Colección" (Home tras login) | FND-07 |
| `/(tabs)/search` | Vacía, título "Buscar" | FND-07 |
| `/(tabs)/profile` | Vacía, título "Perfil" (+ botón cerrar sesión, necesario para e2e repetibles) | FND-07 |
Sin sesión → redirige a sign-in; con sesión → tabs. Cada elemento interactivo lleva `testID` para Maestro.

## CI (`.github/workflows/ci.yml`, en cada PR)
| Job | Pasos | Req |
|---|---|---|
| `checks` | pnpm install → typecheck → lint → test (Jest) | FND-01, 05 |
| `db` | `supabase start` → `supabase test db` | FND-04 |
| `e2e` | `supabase start` → `expo prebuild -p android` → `gradlew assembleRelease` (env E2E: URL `http://10.0.2.2:54321`) → `reactivecircus/android-emulator-runner` → `maestro test apps/mobile/e2e` | FND-03, 07 |
| `secrets` | `git grep -i service_role -- apps/` debe estar vacío | FND-08 |
Secretos de Google/Apple solo en Supabase (dashboard) / env de CI; nunca en `EXPO_PUBLIC_*`.

## Dependencias nuevas (Ask First: se aprueban al aprobar este spec)
- Raíz (dev): `typescript`, `eslint`, `typescript-eslint`, `eslint-config-expo`, `eslint-plugin-i18next`, `supabase` (CLI por npm, evita instalación global).
- `apps/mobile`: las que fija Expo SDK 57 (`expo`, `react`, `react-native`, `expo-router` y sus peers), `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `@tanstack/react-query`, `i18next`, `react-i18next`, `expo-localization`, `expo-web-browser`, `expo-apple-authentication`, `expo-build-properties` (HTTP claro solo en build E2E). Dev: `jest`, `jest-expo`, `@types/jest`.
- CI (GitHub Actions de terceros): `pnpm/action-setup`, `supabase/setup-cli`, `reactivecircus/android-emulator-runner`, instalador oficial de Maestro.

## Decisiones y alternativas descartadas
- **Expo Go vs build nativo**: e2e usa APK release compilado en CI (Maestro necesita la app instalada y reproducible). Desarrollo local puede usar Expo Go; Apple Sign-In nativo funciona en Expo Go iOS.
- **Google**: OAuth vía navegador (`signInWithOAuth` + deep link `apptcg://`) en lugar de Google Sign-In nativo: sin plugin nativo extra y funciona en Expo Go.
- **i18n**: i18next (estándar, pluralización); descartado `expo-localization` solo con diccionarios propios (habría que reimplementar interpolación).
- **Username**: `user_xxxxxxxx` sin datos del email (perfil puede ser público). Descartado derivarlo del email.
- **Tipos DB** en `packages/shared` (no en la app) para que F2 (`packages/ingest`) los comparta.
- **ADR-001** (runner de ingesta) no se decide en F1: no hay requisito de ingesta aquí; se decide en `/spec F2`.

## Riesgos → cómo se detectan (test)
| Riesgo | Detección |
|---|---|
| Esta máquina no tiene Docker, Supabase CLI, Java, Android SDK, Maestro ni `gh`; no hay repo git ni remoto | Las tareas con `supabase`/Maestro/CI quedan `UNDECIDABLE_UNDER(<herramienta> local)` si Vik no las instala; su score real lo da el job de CI equivalente |
| Emulador en Actions lento/inestable | Job `e2e` con timeout 45 min y 1 reintento de Maestro; si falla 3 PRs seguidos → revisar opción Maestro local |
| Código OTP no llega al emulador | `e2e/scripts/get-otp.js` lee la API de Mailpit; test `auth.yaml` falla explícitamente si no hay correo |
| App release no alcanza Supabase local (HTTP) | `auth.yaml` falla en "Enviar código"; mitigado con `usesCleartextTraffic` solo si `E2E=1` |
| Strings hardcodeadas | `pnpm lint` + test Jest `no-literal-strings` |
| `service_role` filtrada a la app | Job `secrets` + Done de FND-08 |
| Google/Apple sin credenciales | FND-03 parcial: `UNDECIDABLE_UNDER(credenciales Google/Apple de Vik)` hasta prueba manual con captura en PR |

## Desviaciones registradas durante la implementación
| Tarea | Desviación | Motivo |
|---|---|---|
| T7 | + `apps/mobile/expo-env.d.ts` (4 archivos) | Tipos de `process.env` de Expo; se commitea para que la CI haga el typecheck sin arrancar Expo |
| T9 | Test con ESLint CLI en un subproceso (no la API en proceso); 2 tests (+1 de control) | Dentro de Jest, ESLint no carga la config y el plugin pierde sus reglas; el test de control evita un falso verde |
| T9–T13 | `i18next/no-literal-string` excluye props técnicas: `name`, `href`, `testID`, `autoCapitalize`, `autoComplete`, `keyboardType`, `tabBarButtonTestID` | No son texto de UI; los textos visibles en atributos (`title`, `placeholder`) se siguen detectando |
| T12 | + `app/index.tsx` (redirige `/` a `/collection`) | Sin ruta índice, `/` no existe |
| T14 | `supabase.ts` con `flowType: "pkce"` | Necesario para el intercambio de código de Google OAuth |
