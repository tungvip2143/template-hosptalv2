/* eslint-disable @typescript-eslint/no-explicit-any */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "./locales/en";
import viLang from "./locales/vi";

const currentLng = "vi";
export const defaultNS = "transition";

i18n.use(initReactI18next).init({
  lng: currentLng,
  fallbackLng: "en",
  defaultNS,
  resources: {
    en: enLang as any,
    vi: viLang as any,
  },

  interpolation: {
    escapeValue: false,
  },
  debug: false,
  react: {
    useSuspense: false,
  },
  returnNull: false,
});

export default i18n;
