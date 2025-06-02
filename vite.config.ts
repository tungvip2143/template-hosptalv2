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
        name: "host_module",
        filename: "remoteHost.js",
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
      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
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
