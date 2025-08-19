/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";
import { PUBLIC_ROUTER } from "./components/route";
import { generateId, MenuType } from "@pnkx-lib/ui";
import { SettingGroupIcon, SettingIcon } from "@pnkx-lib/icon";

// Lazy load các component
const DefaultPage = lazy(() => import("@src/pages/DefaultPage"));

const menuRouter: MenuType[] = [
  {
    id: generateId("Quản lý demo"),
    name: "Quản lý demo",
    icon: <SettingGroupIcon className="router-icon" />,
    children: [
      {
        id: generateId("Thiết lập demo"),
        name: "Thiết lập demo",
        path: PUBLIC_ROUTER.HOME,
        component: DefaultPage,
        icon: <SettingIcon className="router-icon" />,
      },
    ],
  },
];

export default menuRouter;
