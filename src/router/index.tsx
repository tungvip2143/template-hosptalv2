/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, lazy, ReactNode } from "react";
import { PUBLIC_ROUTER } from "./components/route";

// Lazy load các component
const SignIn = lazy(() => import("@src/pages/SignIn"));
const Page404 = lazy(() => import("@src/pages/Page404"));
const DefaultLayout = lazy(() => import("@src/pages/DefaultLayout"));

export type MenuType = {
  name: string;
  path: string;
  isShow: boolean;
  isPrivateRoute?: boolean;
  layout?:
    | React.LazyExoticComponent<React.MemoExoticComponent<any>>
    | React.ExoticComponent<any>
    | typeof React.Component;
  children: {
    name: string;
    path: string;
    icon?: ReactNode;
    isShowChildren?: boolean;
    component: typeof React.Component | React.FC;
    children?: Array<{
      name: string;
      path: string;
      icon: ReactNode;
      component: typeof React.Component | React.FC;
      children?: Array<{
        name: string;
        path: string;
        icon: ReactNode;
        component: typeof React.Component | React.FC;
      }>;
    }>;
  }[];
};

const menuRouter: MenuType[] = [
  {
    name: "Login Layout",
    path: PUBLIC_ROUTER.SIGN_IN,
    layout: Fragment,
    isShow: false,
    children: [
      {
        name: "Sign In",
        path: PUBLIC_ROUTER.SIGN_IN,
        component: SignIn,
      },
    ],
  },
  {
    name: "page404",
    path: PUBLIC_ROUTER.PAGE_404,
    layout: Fragment,
    isShow: false,
    children: [
      {
        name: "404",
        path: PUBLIC_ROUTER.PAGE_404,
        component: Page404,
      },
    ],
  },
  {
    name: "Home Layout",
    path: PUBLIC_ROUTER.HOME,
    layout: DefaultLayout,
    isPrivateRoute: false,
    isShow: true,

    children: [
      {
        name: "404",
        path: PUBLIC_ROUTER.PAGE_404,
        component: Page404,
      },
      {
        name: "Default Page",
        path: PUBLIC_ROUTER.DEFAULT_PAGE,
        component: lazy(() => import("@src/pages/DefaultPage")),
      },
    ],
  },
];

export default menuRouter;
