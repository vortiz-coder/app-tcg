import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function CollectionScreen() {
  const { t } = useTranslation();
  return (
    <View testID="screen-collection" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{t("tabs.collection")}</Text>
    </View>
  );
}
