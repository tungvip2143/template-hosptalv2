import {
  loadDefaultExports,
  loadNamedExportsFromConfig,
} from "./utils/moduleLoader";

// Configuration for default exports
const DEFAULT_EXPORTS = ["useGetListCategoryRoom", "CommonSelects"] as const;

// Configuration for named exports
const NAMED_EXPORTS_CONFIG = [
  {
    path: "categoryModule/useInfiniteCategoryCommonService",
    exports: ["useInfiniteCategoryCommonService"],
  },
  {
    path: "categoryModule/useGetListCategoryRoom",
    exports: ["useGetListCategoryRoom"],
  },
  {
    path: "categoryModule/useGetCategoryRoomDetail",
    exports: ["useGetCategoryRoomDetail"],
  },
] as const;

// Load and export default exports
const defaultExports = await loadDefaultExports(
  "categoryModule",
  DEFAULT_EXPORTS
);

export const { CommonSelects } = defaultExports;

// Load and export named exports
const namedExports = await loadNamedExportsFromConfig(NAMED_EXPORTS_CONFIG);

export const {
  useInfiniteCategoryCommonService,
  useGetListCategoryRoom,
  useGetCategoryRoomDetail,
} = namedExports;
