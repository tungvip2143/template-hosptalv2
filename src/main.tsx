import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "@pnkx-lib/ui/dist/style.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "@pnkx-lib/ui";
import "./i18n";
import { AppConfigProvider } from "./providers/ConfigProvider";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppConfigProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
              position="bottom"
            />
          </QueryClientProvider>
        </BrowserRouter>
      </AppConfigProvider>
    </ErrorBoundary>
  </StrictMode>
);
