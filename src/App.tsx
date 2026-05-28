import "./styles/App.css";
import { Navigate, Route, Routes } from "react-router";
import { DefaultLayoutCommon, SiteAccessDeniedModal } from "@pnkx-lib/ui";
import { standaloneRouteManifest } from "./router/routeManifest";

import {
  AuthGuard,
  getPhenikaaOAuthConfig,
  redirectToKeycloak,
} from "@pnkx-lib/core";
import { APP_CONFIG } from "./app.config";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={APP_CONFIG.defaultRoute} replace />}
        />
        <Route
          path="*"
          element={
            <AuthGuard
              redirectToLogin={() => redirectToKeycloak(getPhenikaaOAuthConfig())}
            >
              <DefaultLayoutCommon routeManifest={standaloneRouteManifest} />
            </AuthGuard>
          }
        />
      </Routes>

      <SiteAccessDeniedModal />
    </>
  );
};

export default App;
