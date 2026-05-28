import type { RouteManifest } from "@pnkx-lib/ui";
import { lazy } from "react";
import { APP_CONFIG } from "@src/app.config";
import { PUBLIC_ROUTER } from "./components/route";

const DefaultPage = lazy(() => import("@src/pages/DefaultPage"));

const DEFAULT_ROUTE_ID = `${APP_CONFIG.remoteName}.defaultPage`;
const DEFAULT_MENU_ID = `${APP_CONFIG.remoteName}.defaultMenu`;
const STANDALONE_ROOT_MENU_ID = `${APP_CONFIG.remoteName}.standaloneRootMenu`;

const routes: RouteManifest["routes"] = [
  {
    id: DEFAULT_ROUTE_ID,
    path: PUBLIC_ROUTER.DEFAULT_PAGE.LIST,
    title: APP_CONFIG.standaloneMenuTitle,
    component: DefaultPage,
    isShowBreadcrumb: true,
    isSearchable: true,
  },
];

const routeManifest: RouteManifest = {
  module: APP_CONFIG.remoteName,
  routes,
  menus: [
    {
      id: DEFAULT_MENU_ID,
      title: APP_CONFIG.standaloneMenuTitle,
      routeId: DEFAULT_ROUTE_ID,
    },
  ],
};

const standaloneRouteManifest: RouteManifest = {
  module: `${routeManifest.module}-standalone`,
  routes,
  menus: [
    {
      id: STANDALONE_ROOT_MENU_ID,
      title: APP_CONFIG.displayName,
      children: routeManifest.menus,
    },
  ],
};

export { routeManifest, standaloneRouteManifest };
export default routeManifest;
