import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { federation } from "@module-federation/vite";
import compression from "vite-plugin-compression";
import tailwindcss from "@tailwindcss/vite";

const DEFAULT_PORT = 3000;
const DEFAULT_PREVIEW_PORT = 8000;
const DEFAULT_CHUNK_SIZE_WARNING_LIMIT = 1024;

export default defineConfig(({ mode }) => {
  // Load env theo mode
  const isProd = mode === "production";

  // Load env nếu cần sử dụng thêm
  // const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "remote_app",
        filename: "remoteEntry.js",
        exposes: {},
        remotes: {},
        shared: {
          react: { singleton: true, strictVersion: true },
          "react-dom": { singleton: true, strictVersion: true },
          "@tanstack/react-query": {
            singleton: true,
            requiredVersion: ">=5.74.4",
          },
        },
      }),
      // Bật nén chỉ khi production
      isProd &&
        compression({
          algorithm: "gzip",
          threshold: 10240,
        }),
    ],

    build: {
      modulePreload: !isProd,
      target: "esnext",
      minify: isProd ? "terser" : false,
      cssCodeSplit: true,
      sourcemap: !isProd,
      chunkSizeWarningLimit: DEFAULT_CHUNK_SIZE_WARNING_LIMIT,
      // Thêm cấu hình để xử lý circular dependency
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: "index.html",
        external: (id) => {
          // Externalize 'antd' và các package phụ thuộc ngoài khác
          if (["antd", "moment"].includes(id)) {
            return true;
          }
          // Externalize Node.js built-in modules only when they're imported by build tools
          if (["fs", "path", "crypto", "util", "stream", "os"].includes(id)) {
            return false; // Don't externalize, let Vite handle the polyfill/error
          }
          return false;
        },

        // Suppress the eval warning for module federation
        onwarn(warning, warn) {
          // Skip eval warnings from module federation
          if (
            warning.code === "EVAL" &&
            warning.id?.includes("@module-federation")
          ) {
            return;
          }
          // Skip circular dependency warnings from @pnkx-lib/ui
          if (
            warning.code === "CIRCULAR_DEPENDENCY" &&
            warning.message &&
            warning.message.includes("@pnkx-lib/ui")
          ) {
            return;
          }
          // Skip reexport warnings that cause circular dependency issues
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
          // Skip externalized module warnings for known Node.js modules
          if (
            warning.code === "UNRESOLVED_IMPORT" &&
            warning.message &&
            ["fs", "path", "crypto", "util", "stream"].some((mod) =>
              warning.message.includes(mod)
            )
          ) {
            return;
          }
          // Skip module externalized warnings for build-time dependencies
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            (warning.message &&
              warning.message.includes(
                "externalized for browser compatibility"
              ))
          ) {
            return;
          }
          warn(warning);
        },
      },
      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            // Configure terser to handle module federation better
            keep_fnames: true,
            mangle: {
              keep_fnames: true,
            },
          }
        : undefined,
    },

    server: {
      port: DEFAULT_PORT,
      strictPort: true,
      hmr: !isProd,
    },

    preview: {
      port: DEFAULT_PREVIEW_PORT,
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@tanstack/react-query",
        "@module-federation/vite",
      ],
    },

    resolve: {
      alias: {
        "@src": "/src",
      },
    },
  };
});
