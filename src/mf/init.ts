import {
  getInstance,
  createInstance as initFederation,
} from "@module-federation/runtime";
import {
  createMF,
  createRemoteConfig,
  getManifestOrigin,
} from "@pnkx-lib/core";
import { APP_CONFIG } from "@src/app.config";

const mf = createMF(
  getInstance,
  initFederation,
  createRemoteConfig([]),
  {
    manifestOrigin: getManifestOrigin(),
    hostAppName: APP_CONFIG.remoteName,
    loadCSS: true,
    cacheDuration: 5 * 60 * 1000,
  },
);

export const initMF = mf.initMF;
export const mfImport = mf.mfImport;
export const clearManifestCache = mf.clearManifestCache;
