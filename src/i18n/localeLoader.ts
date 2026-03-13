/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepMerge } from "@pnkx-lib/core";
import { RemoteName } from "@pnkx-lib/core";
import { moduleImports, autoRegisterModule } from "./moduleRegistry";

// Import local locales
import enLocale from "@src/locales/en";
import viLocale from "@src/locales/vi";

/**
 * Load local locales của dự án hiện tại
 * @returns Local resources
 */
export function loadLocalLocales() {
  return {
    en: enLocale,
    vi: viLocale,
  };
}

/**
 * Load locales từ một remote module
 * @param moduleName - Tên module
 * @returns Data locales hoặc null nếu lỗi
 */
async function loadRemoteLocales(moduleName: string): Promise<any | null> {
  try {
    // Auto-register module nếu chưa có
    autoRegisterModule(moduleName);

    // Lấy import function từ registry
    const importFn = moduleImports[moduleName];
    if (!importFn) {
      console.warn(`⚠️ Module ${moduleName} not found in registry`);
      return null;
    }

    // Dynamic import từ registry
    const locales = (await importFn()) as any;
    const data = locales.default || locales[`${moduleName}Locales`] || locales;
    return data;
  } catch (error) {
    console.warn(`⚠️ Failed to load ${moduleName} locales:`, error);
    return null;
  }
}

/**
 * Load và gộp tất cả locales từ local và remote modules
 * @returns Merged resources cho i18n
 */
export async function loadAllRemoteLocales() {
  // Bắt đầu với local locales
  const localResources = loadLocalLocales();
  const mergedResources: any = {
    en: { ...localResources.en },
    vi: { ...localResources.vi },
  };

  try {
    // Load từ tất cả remote modules
    const moduleNames = Object.values(RemoteName);

    for (const moduleName of moduleNames) {
      const moduleData = await loadRemoteLocales(moduleName);

      if (moduleData) {
        // Merge dữ liệu cho mỗi ngôn ngữ
        if (moduleData.en) {
          mergedResources.en = deepMerge(mergedResources.en, moduleData.en);
        }
        if (moduleData.vi) {
          mergedResources.vi = deepMerge(mergedResources.vi, moduleData.vi);
        }
      }
    }

    return mergedResources;
  } catch (error) {
    console.error("❌ Failed to load remote locales:", error);
    // Fallback với local locales
    return {
      en: {
        ...localResources.en,
        common: { ...localResources.en.actionClinical, loading: "Loading..." },
      },
      vi: {
        ...localResources.vi,
        common: { ...localResources.vi.actionClinical, loading: "Đang tải..." },
      },
    };
  }
}
