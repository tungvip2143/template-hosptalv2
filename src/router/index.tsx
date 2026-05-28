import { createLegacyMenuRouterFromManifest } from "@pnkx-lib/ui";
import { standaloneRouteManifest } from "./routeManifest";

const menuRouter = createLegacyMenuRouterFromManifest(standaloneRouteManifest);

export default menuRouter;
