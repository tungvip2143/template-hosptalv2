/* eslint-disable @typescript-eslint/no-explicit-any */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18N_CONFIG } from "./i18n/config";
import enLang from "./locales/en";
import viLang from "./locales/vi";

export const defaultNS = I18N_CONFIG.defaultNS;

void i18n.use(initReactI18next).init({
  lng: I18N_CONFIG.currentLng,
  fallbackLng: I18N_CONFIG.fallbackLng,
  defaultNS,
  resources: {
    en: enLang as any,
    vi: viLang as any,
  },
  interpolation: I18N_CONFIG.interpolation,
  debug: I18N_CONFIG.debug,
  react: I18N_CONFIG.react,
  returnNull: I18N_CONFIG.returnNull,
});

export default i18n;
