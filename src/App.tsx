/* eslint-disable @typescript-eslint/no-explicit-any */
import "./styles/App.css";
import { Route, Routes } from "react-router";
import DefaultLayout from "./pages/DefaultLayout";

import {
  AuthGuard,
  getPhenikaaOAuthConfig,
  redirectToKeycloak,
} from "@pnkx-lib/core";
import { SiteAccessDeniedModal } from "@pnkx-lib/ui";

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
              <DefaultLayout />
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
