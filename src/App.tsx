/* eslint-disable @typescript-eslint/no-explicit-any */
import "./styles/App.css";
import { Skeleton } from "@pnkx-lib/ui";
import { Fragment, Suspense } from "react";
import { Route, Routes } from "react-router";
import PrivateRoute from "./router/components/PrivateRoute/PrivateRoute";
import menuRouter from "./router";
// import AppRedirectHandler from "./components/AppRedirectHandler";

const traverseModules = (
  moduleList: any[],
  Layout: any = Fragment,
  isPrivate: boolean
): JSX.Element[] => {
  const renderRouteElement = (Component: any) => {
    const element = (
      <Layout>
        <Component />
      </Layout>
    );
    return isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element;
  };

  return moduleList.flatMap(({ path, component: Component, children }, idx) => {
    const routes: JSX.Element[] = [];

    if (Component && path) {
      routes.push(
        <Route
          key={`${path}-${idx}`}
          path={path}
          element={renderRouteElement(Component)}
        />
      );
    }

    if (children?.length) {
      routes.push(...traverseModules(children, Layout, isPrivate));
    }

    return routes;
  });
};

const App: React.FC = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      {/* <AppRedirectHandler /> */}
      <Routes>
        {menuRouter.flatMap(({ children = [], component, isPrivateRoute }) =>
          traverseModules(
            children,
            component ?? Fragment,
            isPrivateRoute ?? false
          )
        )}
      </Routes>
    </Suspense>
  );
};

export default App;
