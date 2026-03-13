/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

let remoteI18n: any = null;

export async function loadRemoteI18n() {
  if (!remoteI18n) {
    // Import i18n instance từ remote
    const mod = (await import("categoryModule/i18n")) as any;
    // Nếu remote export default
    remoteI18n = mod.default || mod.i18n || mod.i18nInstance;
  }
  return remoteI18n;
}

// Hook để đảm bảo i18n đã sẵn sàng trước khi render app
export function useRemoteI18n() {
  useEffect(() => {
    loadRemoteI18n().then(() => {
      // Optionally: set language, add resource, v.v.
      // i18n.changeLanguage("vi");
    });
  }, []);
}
