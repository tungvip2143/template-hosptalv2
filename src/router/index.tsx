/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, lazy } from "react";
import { PUBLIC_ROUTER } from "./components/route";
import { generateId, MenuType } from "@pnkx-lib/ui";

// Lazy load các component
const SignIn = lazy(() => import("@src/pages/SignIn"));
const DefaultLayout = lazy(() => import("@src/pages/DefaultLayout"));
const DefaultPage = lazy(() => import("@src/pages/DefaultPage"));

const menuRouter: MenuType[] = [
  {
    id: generateId("Login Layout"),
    name: "Login Layout",
    path: PUBLIC_ROUTER.SIGN_IN,
    component: Fragment,
    isShowChildren: true,
    children: [
      {
        id: generateId("Sign In"),
        name: "Sign In",
        path: PUBLIC_ROUTER.SIGN_IN,
        component: SignIn,
      },
    ],
  },

  {
    id: generateId("Home Layout"),
    name: "Home Layout",
    path: PUBLIC_ROUTER.HOME,
    component: DefaultLayout,
    isPrivateRoute: false,
    isShowChildren: true,
    children: [
      {
        id: generateId("Default Page"),
        name: "Default Page",
        path: PUBLIC_ROUTER.HOME,
        component: DefaultPage,
      },
    ],
  },
];

export default menuRouter;
