import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "@pnkx-lib/ui/dist/style.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "@pnkx-lib/ui";
import "./i18n/config";
import { AppConfigProvider } from "./providers/ConfigProvider";
import { ACCESS_TOKEN } from "@pnkx-lib/core";
import { loadAllRemoteCSS } from "./utils/simpleCSS";
import { initGatewayI18n } from "./i18n";
import { I18nextProvider } from "react-i18next";
import AppRedirectHandler from "./components/AppRedirectHandler";

const queryClient = new QueryClient();
localStorage.setItem(ACCESS_TOKEN, import.meta.env.VITE_ACCESS_TOKEN);

async function bootstrap() {
  // Load remote CSS trước khi khởi tạo app
  loadAllRemoteCSS();

  // Load i18n từ tất cả remote modules và tổng hợp
  const i18n = await initGatewayI18n();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
        <AppConfigProvider>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <AppRedirectHandler />
                <App />
                <ReactQueryDevtools
                  initialIsOpen={false}
                  buttonPosition="bottom-right"
                  position="bottom"
                />
              </QueryClientProvider>
            </BrowserRouter>
          </I18nextProvider>
        </AppConfigProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

bootstrap();
