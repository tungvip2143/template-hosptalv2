import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadAllRemoteLocales } from "./localeLoader";
import { I18N_CONFIG } from "./config";

/**
 * Khởi tạo i18n với merged resources từ remote modules
 * @returns Configured i18n instance
 */
export async function initGatewayI18n() {
  const resources = await loadAllRemoteLocales();

  await i18n.use(initReactI18next).init({
    ...I18N_CONFIG,
    resources,
  });

  return i18n;
}

// Re-export utilities
export { registerModule } from "./moduleRegistry";
export { loadAllRemoteLocales, loadLocalLocales } from "./localeLoader";

export default i18n;
