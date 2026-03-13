/* eslint-disable @typescript-eslint/no-explicit-any */
import { initMF, mfImport } from "../../init";
import { createModuleLoader } from "@pnkx-lib/core";

await initMF();

// Khởi tạo với mfImport từ consumer
export const moduleLoader = createModuleLoader(mfImport);

export const { loadDefaultExports, loadNamedExportsFromConfig } = moduleLoader;
