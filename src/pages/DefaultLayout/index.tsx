/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, Suspense } from "react";
import menuRouter from "@src/router";
import {
  extractRoutesFromMenu,
  PageNotFound,
  Sidebar,
  Skeleton,
} from "@pnkx-lib/ui";
import { Route, Routes } from "react-router";

function DefaultLayout() {
  const menuSidebar = extractRoutesFromMenu(menuRouter);
  return (
    <Fragment>
      <Sidebar menu={menuRouter}>
        <div className="pl-6 pt-15 h-full bg-[#ECEFF3] pr-6">
          <Suspense fallback={<Skeleton />}>
            <Routes>
              {menuSidebar.map((route, idx) => {
                const Component = route.component;
                return (
                  <Route
                    key={route?.path || idx}
                    path={route.path}
                    element={<Component />}
                  />
                );
              })}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Sidebar>
    </Fragment>
  );
}

export default DefaultLayout;
