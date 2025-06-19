/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, lazy } from "react";
import { PUBLIC_ROUTER } from "./components/route";
import { MenuType, PageNotFound } from "@pnkx-lib/ui";

// Lazy load các component
const SignIn = lazy(() => import("@src/pages/SignIn"));
const DefaultLayout = lazy(() => import("@src/pages/DefaultLayout"));
const DefaultPage = lazy(() => import("@src/pages/DefaultPage"));

const menuRouter: MenuType[] = [
  {
    name: "Login Layout",
    path: PUBLIC_ROUTER.SIGN_IN,
    component: Fragment,
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
    name: "PageNotFound",
    path: PUBLIC_ROUTER.PAGE_404,
    component: Fragment,
    isShow: false,
    children: [
      {
        name: "404",
        path: PUBLIC_ROUTER.PAGE_404,
        component: PageNotFound,
      },
    ],
  },
  {
    name: "Home Layout",
    path: PUBLIC_ROUTER.HOME,
    component: DefaultLayout,
    isPrivateRoute: false,
    isShow: true,
    children: [
      {
        name: "Default Page",
        path: PUBLIC_ROUTER.HOME,
        component: DefaultPage,
      },
    ],
  },
];

export default menuRouter;
