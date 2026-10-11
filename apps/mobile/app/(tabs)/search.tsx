import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function SearchScreen() {
  const { t } = useTranslation();
  return (
    <View testID="screen-search" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{t("tabs.search")}</Text>
    </View>
  );
}
