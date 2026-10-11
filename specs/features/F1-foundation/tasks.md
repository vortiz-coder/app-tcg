# F1 — Tareas
Una tarea por prompt; cada una toca ≤ 3 archivos o se parte. Gate en todas: `pnpm typecheck && pnpm lint` (desde T9; antes, solo `pnpm typecheck`).

**Prerrequisitos de Vik** (sin ellos, las tareas marcadas ⚙ quedan `UNDECIDABLE_UNDER(<herramienta>)`):
Docker Desktop (⚙ T4–T6) · Java 17 + Android SDK/emulador + Maestro (⚙ T15) · repo en GitHub + `gh` (⚙ T16) · credenciales Google/Apple (⚙ T14 manual).

- [x] **F1-T1** Workspace raíz: `package.json` (scripts typecheck/lint/test/e2e/gen:types), `pnpm-workspace.yaml`, `tsconfig.base.json`.
  Done = `pnpm install && pnpm typecheck` → exit 0.  (FND-01)
  ↳ 2026-10-11 PASS: pnpm typecheck → "No projects matched the filters" (exit 0)
- [x] **F1-T2** `git init`, `.gitignore` (node_modules, .env, .expo, android/, ios/), `.env.example` solo con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
  Done = `git grep -i service_role -- apps/ ; test $? -eq 1` → exit 0 (sin coincidencias).  (FND-08)
  ↳ 2026-10-11 PASS: git grep service_role -- apps/ sin coincidencias (exit 0)
- [x] **F1-T3** `packages/shared`: `package.json`, `tsconfig.json`, `src/index.ts`.
  Done = `pnpm typecheck` → exit 0.  (FND-01)
  ↳ 2026-10-11 PASS: @app-tcg/shared tsc --noEmit (exit 0)
- [x] **F1-T4** ⚙ Supabase local: `supabase/config.toml` (OTP email 6 dígitos, Google/Apple con `env(...)`), `supabase/templates/otp.html`, devDep `supabase` en `package.json` raíz.
  Done = `pnpm exec supabase start` → exit 0 y muestra "API URL".  (FND-03, FND-08)
  ↳ 2026-10-11 UNDECIDABLE_UNDER(Docker local): archivos escritos; `supabase start` → "docker: command not found"
  ↳ 2026-10-11 PASS: `pnpm exec supabase start` exit 0 · "API_URL":"http://127.0.0.1:54321" · migración profiles aplicada
- [x] **F1-T5** ⚙ Migración `profiles` + trigger + RLS y su test pgTAP (`supabase/migrations/<ts>_profiles.sql`, `supabase/tests/profiles.test.sql`).
  Done = `pnpm exec supabase db reset && pnpm exec supabase test db` → "All tests successful".  (FND-04)
  ↳ 2026-10-11 UNDECIDABLE_UNDER(Docker local): migración y test pgTAP (8 asserts) escritos, sin ejecutar
  ↳ 2026-10-11 PASS: `supabase test db` → "All tests successful. Files=1, Tests=8 · Result: PASS"
- [x] **F1-T6** ⚙ Tipos DB: `pnpm gen:types` → `packages/shared/src/database.ts`, exportado desde `src/index.ts`.
  Done = `pnpm gen:types && pnpm typecheck` → exit 0 y `grep -c profiles packages/shared/src/database.ts` ≥ 1.  (FND-01, FND-04)
  ↳ 2026-10-11 UNDECIDABLE_UNDER(Docker local): `supabase gen types --local` necesita la DB local
  ↳ 2026-10-11 PASS: `pnpm gen:types && pnpm typecheck` exit 0 · `grep -c profiles database.ts` = 1
- [x] **F1-T7** App Expo: `apps/mobile/package.json` (SDK 57), `app.config.ts` (scheme `apptcg`, env), `tsconfig.json` (extiende base, strict).
  Done = `pnpm install && pnpm --filter mobile typecheck` → exit 0.  (FND-02)
  ↳ 2026-10-11 PASS: mobile tsc --noEmit (exit 0). Extra: apps/mobile/expo-env.d.ts (tipos de process.env de Expo)
- [x] **F1-T8** i18n: `src/i18n/index.ts` (es por defecto, en), `src/i18n/locales/es.json`, `en.json` (claves de tabs, auth y errores).
  Done = `pnpm --filter mobile typecheck` → exit 0.  (FND-05)
  ↳ 2026-10-11 PASS: mobile tsc --noEmit (exit 0)
- [x] **F1-T9** Lint + test i18n: `eslint.config.js` raíz (con `i18next/no-literal-string`), `apps/mobile/jest.config.js`, `apps/mobile/__tests__/no-literal-strings.test.ts`.
  Done = `pnpm lint && pnpm test` → exit 0 y Jest "Tests: 1 passed".  (FND-05)
  ↳ 2026-10-11 PASS: pnpm lint exit 0 · Jest "Tests: 2 passed, 2 total" (incluye test de control: la regla detecta texto JSX literal). Jest en 2 projects: app (jest-expo) e i18n-lint (node, ESLint CLI en subproceso)
- [x] **F1-T10** Navegación: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/collection.tsx`.
  Done = `pnpm typecheck && pnpm lint && pnpm test` → exit 0.  (FND-02, FND-07)
  ↳ 2026-10-11 PASS: typecheck+lint exit 0 · Jest "Tests: 2 passed, 2 total". Ajuste: regla i18n excluye props técnicas (name, testID, tabBarButtonTestID)
- [x] **F1-T11** Tabs restantes: `app/(tabs)/search.tsx`, `app/(tabs)/profile.tsx`.
  Done = `pnpm --filter mobile exec expo export` → exit 0.  (FND-02, FND-07)
  ↳ 2026-10-11 PASS: expo export → "Exported: dist" (exit 0)
- [x] **F1-T12** Sesión: `src/lib/supabase.ts` (anon key), `src/lib/auth.tsx` (SessionProvider), redirección en `app/_layout.tsx`.
  Done = `pnpm typecheck && pnpm lint && pnpm --filter mobile exec expo export` → exit 0.  (FND-03, FND-08)
  ↳ 2026-10-11 PASS: typecheck+lint exit 0 · expo export → "Exported: dist" (exit 0). 4 archivos: + app/index.tsx (redirect "/" → /collection)
- [x] **F1-T13** Login OTP: `app/(auth)/sign-in.tsx` + claves en `es.json`/`en.json` (incluye etiquetas Google/Apple); botón cerrar sesión en `profile.tsx` va en T15.
  Done = `pnpm typecheck && pnpm lint && pnpm test && pnpm --filter mobile exec expo export` → exit 0.  (FND-03, FND-05)
  ↳ 2026-10-11 PASS: typecheck+lint exit 0 · Jest "Tests: 2 passed" · expo export → "Exported: dist" (exit 0). Regla i18n: + autoCapitalize/autoComplete/keyboardType excluidas
- [ ] **F1-T14** ⚙ Google + Apple: `src/lib/oauth.ts`, botones en `sign-in.tsx`.
  Done = `pnpm typecheck && pnpm lint && pnpm --filter mobile exec expo export` → exit 0; parte manual = `UNDECIDABLE_UNDER(credenciales Google/Apple de Vik)` hasta captura en PR.  (FND-03)
  ↳ 2026-10-11 parte automática PASS: typecheck+lint exit 0 · expo export "Exported: dist" · parte manual UNDECIDABLE_UNDER(credenciales Google/Apple de Vik). + supabase.ts flowType "pkce"
- [ ] **F1-T15** ⚙ E2E: `e2e/auth.yaml` (OTP vía Mailpit → ve Colección), `e2e/tabs.yaml` (navega las 3 tabs), `e2e/scripts/get-otp.js`; botón cerrar sesión en `profile.tsx` si hace falta → partir en T15a/T15b.
  Done = `pnpm e2e` → Maestro "Flow Passed" en `auth.yaml` y `tabs.yaml`.  (FND-03, FND-07)
  ↳ 2026-10-11 UNDECIDABLE_UNDER(Maestro + emulador Android local): flujos escritos; `pnpm e2e` → "maestro" no reconocido. Sin botón de logout: `launchApp clearState` deja la app sin sesión
- [ ] **F1-T16** ⚙ CI: `.github/workflows/ci.yml` (jobs checks, db, e2e, secrets) y PR de prueba.
  Done = `gh pr checks <PR>` → todos los checks "pass".  (FND-06, FND-08)
  ↳ 2026-10-11 UNDECIDABLE_UNDER(repo en GitHub + gh): ci.yml escrito (jobs checks, secrets, db, e2e), YAML válido (js-yaml); sin PR no hay check
- [ ] **F1-T17** Verificación por el subagente `verifier` contra `requirements.md` y registro en `specs/02-roadmap.md#registro`.
