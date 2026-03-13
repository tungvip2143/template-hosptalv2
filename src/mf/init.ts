import {
  getInstance,
  createInstance as initFederation,
} from "@module-federation/runtime";
import {
  createMF,
  createRemoteConfig,
  getManifestOrigin,
  RemoteName,
} from "@pnkx-lib/core";

const mf = createMF(
  getInstance,
  initFederation,
  createRemoteConfig([
    RemoteName.CategoryModule,
    RemoteName.ReceptionModule,
  ]),
  {
    manifestOrigin: getManifestOrigin(),
    hostAppName: "remote_app",
    loadCSS: true,
    cacheDuration: 5 * 60 * 1000,
  },
);

// Export the functions with the same names as your current code
export const initMF = mf.initMF;
export const mfImport = mf.mfImport;
export const clearManifestCache = mf.clearManifestCache;
