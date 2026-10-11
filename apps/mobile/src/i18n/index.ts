import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import es from "./locales/es.json";
import en from "./locales/en.json";

const resources = { es: { translation: es }, en: { translation: en } };
const device = getLocales()[0]?.languageCode ?? "es";

i18n.use(initReactI18next).init({
  resources,
  lng: device in resources ? device : "es",
  fallbackLng: "es",
  interpolation: { escapeValue: false }, // React already escapes
});

export default i18n;
