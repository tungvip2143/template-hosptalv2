import {
  HIS_MODULES,
  type HisModuleKey,
} from "@pnkx-lib/core/constants/hisModules";

type AppConfig = {
  displayName: string;
  standaloneMenuTitle: string;
  remoteName: string;
  runtimeModule: HisModuleKey;
  basePath: string;
  defaultRoute: string;
  devPort: number;
  previewPort: number;
};

export const APP_CONFIG: AppConfig = {
  displayName: "HIS Service Seed",
  standaloneMenuTitle: "Màn hình mẫu",
  remoteName: "templateModule",
  runtimeModule: HIS_MODULES.SYSTEM,
  basePath: "/mf/template/",
  defaultRoute: "/man-hinh-mau",
  devPort: 3020,
  previewPort: 8020,
};
