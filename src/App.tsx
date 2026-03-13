import "./styles/App.css";
import { Route, Routes } from "react-router";
import { DefaultLayoutCommon, SiteAccessDeniedModal } from "@pnkx-lib/ui";
import menuRouter from "./router";

import {
  AuthGuard,
  getPhenikaaOAuthConfig,
  redirectToKeycloak,
} from "@pnkx-lib/core";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={
            <AuthGuard
              redirectToLogin={() =>
                redirectToKeycloak(
                  getPhenikaaOAuthConfig(),
                )
              }
            >
              <DefaultLayoutCommon menuRouter={menuRouter} />
            </AuthGuard>
          }
        />
      </Routes>

      {/* Site Access Control - Auto shows modal when user accesses unauthorized site */}
      <SiteAccessDeniedModal />
    </>
  );
};

export default App;
