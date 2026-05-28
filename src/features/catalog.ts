import {
  buildFeatureCatalogFromSources,
  type FeatureSourceModule,
} from "@pnkx-lib/core/features";
import { APP_CONFIG } from "@src/app.config";

const sourceModules = import.meta.glob<FeatureSourceModule>("./flags/*/index.ts", {
  eager: true,
});

export const FEATURE_CATALOG = buildFeatureCatalogFromSources({
  module: APP_CONFIG.runtimeModule,
  sourceModules,
});
