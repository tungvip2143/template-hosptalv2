import {
  RuntimeFlagProvider as CoreRuntimeFlagProvider,
  TokenStore,
  fetchRuntimeFlags,
  normalizeRuntimeEnvironment,
} from "@pnkx-lib/core";
import type { ReactNode } from "react";
import { DEFAULT_RUNTIME_FLAGS } from "@src/features";
import { APP_CONFIG } from "@src/app.config";

type RuntimeFlagProviderProps = {
  children: ReactNode;
};

export function RuntimeFlagProvider({
  children,
}: RuntimeFlagProviderProps) {
  return (
    <CoreRuntimeFlagProvider
      defaultFlags={DEFAULT_RUNTIME_FLAGS}
      globalStoreMode="merge"
      isAuthenticated={() => TokenStore.isTokenValid()}
      loadFlags={() =>
        fetchRuntimeFlags({
          module: APP_CONFIG.runtimeModule,
          environment: normalizeRuntimeEnvironment(import.meta.env.VITE_APP_ENV),
        })
      }
      loadErrorMessage="Không thể tải giá trị flag từ monitor. Đang dùng cấu hình mặc định."
      onLoadError={(runtimeFlagError) => {
        console.error("[RuntimeFlagProvider] Failed to load runtime flags", {
          runtimeFlagError,
        });
      }}
      loadingFallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-sky-600" />
            <p className="text-sm text-slate-600">
              Đang tải runtime flag từ monitor...
            </p>
          </div>
        </div>
      }
    >
      {children}
    </CoreRuntimeFlagProvider>
  );
}
