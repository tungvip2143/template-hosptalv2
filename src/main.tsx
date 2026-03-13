import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "@pnkx-lib/ui/dist/style.css";

import App from "./App";
import AppRedirectHandler from "./components/AppRedirectHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "@pnkx-lib/ui";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./i18n";

import {
  AuthBootstrap,
  tokenRefreshService,
  tokenSyncService,
  AuthProvider,
  GenericOAuthTokenProvider,
  getPhenikaaOAuthConfig,
} from "@pnkx-lib/core";
import { AppConfigProvider } from "./providers/ConfigProvider";

const queryClient = new QueryClient();

async function bootstrap() {
  const devTokenProvider = new GenericOAuthTokenProvider();

  // Init token services
  tokenSyncService.init();
  tokenRefreshService.configure(devTokenProvider, {
    enableAutoRefresh: true,
  });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
        <AppConfigProvider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <AuthBootstrap
                config={getPhenikaaOAuthConfig()}
                tokenProvider={devTokenProvider}
              >
                <AuthProvider>
                  <AppRedirectHandler />
                  <App />
                  <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="bottom-right"
                    position="bottom"
                  />
                </AuthProvider>
              </AuthBootstrap>
            </QueryClientProvider>
          </BrowserRouter>
        </AppConfigProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}

bootstrap();
