import { generateId, MenuType } from "@pnkx-lib/ui";
import { lazy } from "react";
import { PUBLIC_ROUTER } from "./components/route";

// Lazy load các component
const DefaultPage = lazy(() => import("@src/pages/DefaultPage"));

const menuRouter: MenuType[] = [
  {
    id: generateId("Màn hình chính"),
    name: "Màn hình chính",
    path: PUBLIC_ROUTER.HOME,
    component: DefaultPage,
  },
];

export default menuRouter;
