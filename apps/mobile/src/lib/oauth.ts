import * as AppleAuthentication from "expo-apple-authentication";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

// FND-03: Google via Supabase OAuth (PKCE) in the system browser; returns to apptcg:/// (index route).
export async function signInWithGoogle() {
  const redirectTo = Linking.createURL("/");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success") return; // user closed the browser

  const code = new URL(result.url).searchParams.get("code");
  if (!code) throw new Error("OAuth redirect without code");
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) throw exchangeError;
}

// FND-03: native Sign in with Apple (iOS), exchanged for a Supabase session.
export async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) throw new Error("Apple sign-in without identity token");
    const { error } = await supabase.auth.signInWithIdToken({ provider: "apple", token: credential.identityToken });
    if (error) throw error;
  } catch (e) {
    if ((e as { code?: string }).code === "ERR_REQUEST_CANCELED") return;
    throw e;
  }
}
