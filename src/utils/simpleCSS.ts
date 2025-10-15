/**
 * Utility đơn giản để load CSS - không async, reliable
 */

import { getCss, RemoteMode, RemoteName } from "@pnkx-lib/core";

/**
 * Load một CSS file đơn giản
 */
export const loadSingleCSS = (url: string): void => {
  if (!url) return;

  // Kiểm tra xem đã load chưa
  const existingLink = document.querySelector(`link[href="${url}"]`);
  if (existingLink) {
    console.log(`📝 CSS already loaded: ${url}`);
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;

  link.onload = () => console.log(`✅ CSS loaded: ${url}`);
  link.onerror = () => console.warn(`❌ CSS failed: ${url}`);

  document.head.appendChild(link);
};

/**
 * Load nhiều CSS files đơn giản
 */
export const loadMultipleCSSSimple = (urls: (string | undefined)[]): void => {
  urls.filter(Boolean).forEach((url) => {
    loadSingleCSS(url as string);
  });
};

/**
 * Load tất cả remote CSS từ env vars
 */
export const loadAllRemoteCSS = (): void => {
  const currentMode = import.meta.env.MODE;
  const isDev = currentMode === "development";
  const remoteMode = isDev ? RemoteMode.Development : RemoteMode.Production;
  const cssUrls = getCss(
    import.meta.env.VITE_CATEGORY_MODULE,
    Object.values(RemoteName),
    remoteMode
  );

  console.log("🎨 Loading remote CSS files...");
  loadMultipleCSSSimple(cssUrls);
};
