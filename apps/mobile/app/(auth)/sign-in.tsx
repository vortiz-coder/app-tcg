import { useState } from "react";
import { Button, Platform, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { signInWithApple, signInWithGoogle } from "../../src/lib/oauth";
import { supabase } from "../../src/lib/supabase";

// FND-03: email OTP. A new email creates the account (and its profile, via DB trigger).
export default function SignInScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendCode = async () => {
    setBusy(true);
    setError(null);
    const { error: e } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setBusy(false);
    if (e) setError(t(e.code === "validation_failed" ? "errors.invalidEmail" : "errors.generic"));
    else setStep("code");
  };

  const verify = async () => {
    setBusy(true);
    setError(null);
    const { error: e } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    setBusy(false);
    if (e) setError(t("errors.invalidCode")); // on success the session guard in _layout navigates to the tabs
  };

  const changeEmail = () => setStep("email");

  const withProvider = (signIn: () => Promise<void>) => async () => {
    setError(null);
    try {
      await signIn();
    } catch {
      setError(t("errors.generic"));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>{t("auth.title")}</Text>
      {step === "email" ? (
        <>
          <TextInput
            testID="input-email"
            placeholder={t("auth.email")}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
          />
          <Button testID="btn-send-code" title={t("auth.sendCode")} onPress={sendCode} disabled={busy || !email.trim()} />
        </>
      ) : (
        <>
          <TextInput
            testID="input-code"
            placeholder={t("auth.code")}
            value={code}
            onChangeText={setCode}
            autoComplete="one-time-code"
            keyboardType="number-pad"
            maxLength={6}
            style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
          />
          <Button testID="btn-verify" title={t("auth.verify")} onPress={verify} disabled={busy || code.trim().length !== 6} />
          <Button testID="btn-change-email" title={t("auth.changeEmail")} onPress={changeEmail} />
        </>
      )}
      <Text style={{ textAlign: "center" }}>{t("auth.or")}</Text>
      <Button testID="btn-google" title={t("auth.google")} onPress={withProvider(signInWithGoogle)} />
      {Platform.OS === "ios" && (
        <Button testID="btn-apple" title={t("auth.apple")} onPress={withProvider(signInWithApple)} />
      )}
      {error && <Text testID="auth-error" style={{ color: "#c00" }}>{error}</Text>}
    </View>
  );
}
