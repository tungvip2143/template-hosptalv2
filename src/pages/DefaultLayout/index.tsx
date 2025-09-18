/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, Suspense } from "react";
import menuRouter from "@src/router";
import {
  createComponentWithProps,
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
        <div className="pl-6 pt-17 h-full bg-[#ECEFF3]">
          <Suspense fallback={<Skeleton />}>
            <Routes>
              {menuSidebar.map((route, idx) => {
                // Tạo component với props nếu có componentProps
                const ComponentWithProps = route.componentProps
                  ? createComponentWithProps(
                      route.component,
                      route.componentProps
                    )
                  : route.component;

                return (
                  <Route
                    key={idx}
                    path={route.path}
                    element={<ComponentWithProps />}
                  />
                );
              })}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>

          {/* <footer className="absolute bottom-0 left-0 w-full text-xs text-gray-500 text-center p-2">
            Build Version: {import.meta.env.VITE_BUILD_VERSION}
          </footer> */}
        </div>
      </Sidebar>
    </Fragment>
  );
}

export default DefaultLayout;
