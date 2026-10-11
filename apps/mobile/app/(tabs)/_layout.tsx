import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

// FND-07: Colección (home), Buscar, Perfil.
export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs>
      <Tabs.Screen name="collection" options={{ title: t("tabs.collection"), tabBarButtonTestID: "tab-collection" }} />
      <Tabs.Screen name="search" options={{ title: t("tabs.search"), tabBarButtonTestID: "tab-search" }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile"), tabBarButtonTestID: "tab-profile" }} />
    </Tabs>
  );
}
