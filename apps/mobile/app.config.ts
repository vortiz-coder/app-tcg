import type { ExpoConfig } from "expo/config";

// E2E builds talk to local Supabase over plain HTTP (http://10.0.2.2:54321); normal builds never allow it.
const e2e = process.env.E2E === "1";

const config: ExpoConfig = {
  name: "App TCG",
  slug: "app-tcg",
  scheme: "apptcg",
  version: "0.1.0",
  orientation: "portrait",
  ios: { bundleIdentifier: "com.apptcg.app", usesAppleSignIn: true },
  android: { package: "com.apptcg.app" },
  plugins: [
    "expo-router",
    "expo-status-bar",
    "expo-localization",
    "expo-web-browser",
    "expo-apple-authentication",
    ["expo-build-properties", { android: { usesCleartextTraffic: e2e } }],
  ],
};

export default config;
