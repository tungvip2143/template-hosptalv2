import {
  buildDefaultRuntimeFlags,
  createRuntimeFeatureManager,
} from "@pnkx-lib/core";
import { FEATURE_CATALOG } from "./catalog";
import { FEATURE_KEYS } from "./keys";

export const Features = createRuntimeFeatureManager(FEATURE_KEYS);

export const DEFAULT_RUNTIME_FLAGS = buildDefaultRuntimeFlags(FEATURE_CATALOG);
