/* eslint-disable @typescript-eslint/no-explicit-any */
import "./styles/App.css";
import { Skeleton } from "@pnkx-lib/ui";
import { Fragment, Suspense } from "react";
import { Route, Routes } from "react-router";
import PrivateRoute from "./router/components/PrivateRoute/PrivateRoute";
import menuRouter from "./router";
import AppRedirectHandler from "./components/AppRedirectHandler";

const traverseModules = (
  moduleList: any[],
  layout: any,
  isPrivate: boolean
): JSX.Element[] => {
  const Layout = layout ?? Fragment;

  const createRouteElement = (Component: any) => {
    const element = (
      <Layout>
        <Component />
      </Layout>
    );
    return isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element;
  };

  return moduleList.flatMap((module, idx) => {
    const Component = module.component;
    const routes = [];

    if (Component && module?.path) {
      routes.push(
        <Route
          key={`${module.path}-${idx}`}
          path={module.path}
          element={createRouteElement(Component)}
        />
      );
    }

    if (module.children?.length) {
      routes.push(...traverseModules(module.children, layout, isPrivate));
    }

    if (module.children?.length) {
      routes.push(...traverseModules(module.children, layout, isPrivate));
    }
    return routes;
  });
};

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AppRedirectHandler />
      <Routes>
        {menuRouter.flatMap((group) =>
          traverseModules(
            group.children,
            group.layout ?? Fragment,
            group.isPrivateRoute ?? false
          )
        )}
      </Routes>
    </Suspense>
  );
}

export default App;
