import { Button, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { supabase } from "../../src/lib/supabase";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const signOut = () => supabase.auth.signOut();
  return (
    <View testID="screen-profile" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{t("tabs.profile")}</Text>
      <Button testID="btn-sign-out" title={t("profile.signOut")} onPress={signOut} />
    </View>
  );
}
