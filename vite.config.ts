import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { federation } from "@module-federation/vite";
import compression from "vite-plugin-compression";
import tailwindcss from "@tailwindcss/vite";
import { RemoteMode } from "@pnkx-lib/core/constants/remotesNames";
import { APP_CONFIG } from "./src/app.config";

const DEFAULT_CHUNK_SIZE_WARNING_LIMIT = 1024;

export default defineConfig(({ mode }) => {
  const isDeployMode = mode !== RemoteMode.Development;

  return {
    base: isDeployMode ? APP_CONFIG.basePath : "/",
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: APP_CONFIG.remoteName,
        dts: false,
        dev: {
          disableDynamicRemoteTypeHints: true,
        },
        filename: "remoteEntry.js",
        exposes: {
          "./routeManifest": "./src/router/routeManifest.tsx",
          "./locales": "./src/locales/index.ts",
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: ">=18.0.0",
          },
          "react-dom": {
            singleton: true,
            requiredVersion: ">=18.0.0",
          },
          "react-router": {
            singleton: true,
            requiredVersion: ">=7.0.0",
          },
          "@pnkx-lib/core": {
            singleton: true,
            requiredVersion: ">=0.1.0-0",
          },
          "@tanstack/react-query": {
            singleton: true,
            requiredVersion: ">=5.74.4",
          },
          i18next: {
            singleton: true,
            requiredVersion: ">=23.0.0",
          },
          "react-i18next": {
            singleton: true,
            requiredVersion: ">=15.0.0",
          },
        },
        library: {
          type: "module",
        },
      }),
      isDeployMode &&
        compression({
          algorithm: "gzip",
          threshold: 10240,
        }),
    ].filter(Boolean),

    build: {
      modulePreload: !isDeployMode,
      target: "esnext",
      minify: isDeployMode ? "terser" : false,
      cssCodeSplit: true,
      sourcemap: !isDeployMode,
      outDir: "dist",
      assetsDir: "assets",
      chunkSizeWarningLimit: DEFAULT_CHUNK_SIZE_WARNING_LIMIT,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: "index.html",
        external: (id) => {
          if (["fs", "path", "crypto", "util", "stream", "os"].includes(id)) {
            return false;
          }
          return false;
        },
        onwarn(warning, warn) {
          if (
            warning.code === "EVAL" &&
            warning.id?.includes("@module-federation")
          ) {
            return;
          }
          if (
            warning.code === "CIRCULAR_DEPENDENCY" &&
            warning.message &&
            warning.message.includes("@pnkx-lib/ui")
          ) {
            return;
          }
          if (
            warning.code === "PLUGIN_WARNING" &&
            warning.message &&
            warning.message.includes("was reexported through module") &&
            warning.message.includes("@pnkx-lib/ui")
          ) {
            return;
          }
          // Skip specific circular dependency warnings for ActionRowTable
          if (
            warning.message &&
            (warning.message.includes('Export "ActionRowTable"') ||
              warning.message.includes("will end up in different chunks") ||
              warning.message.includes("circular dependency between chunks"))
          ) {
            return;
          }
          if (
            warning.code === "UNRESOLVED_IMPORT" &&
            warning.message &&
            ["fs", "path", "crypto", "util", "stream"].some((mod) =>
              warning.message.includes(mod),
            )
          ) {
            return;
          }
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            (warning.message &&
              warning.message.includes(
                "externalized for browser compatibility",
              ))
          ) {
            return;
          }
          warn(warning);
        },
      },
      terserOptions: isDeployMode
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            keep_fnames: true,
            mangle: {
              keep_fnames: true,
            },
          }
        : undefined,
    },

    server: {
      port: APP_CONFIG.devPort,
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      strictPort: true,
    },

    preview: {
      port: APP_CONFIG.previewPort,
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@tanstack/react-query",
        "@module-federation/vite",
        "@pnkx-lib/core",
        "@pnkx-lib/ui",
      ],
    },

    resolve: {
      alias: {
        "@src": "/src",
      },
    },
  };
});
