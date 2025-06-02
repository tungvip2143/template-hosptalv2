/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sidebar } from "@pnkx-lib/ui";
import { ReactNode } from "react";
import menuRouter from "@src/router";

interface LayoutProps {
  children: ReactNode;
}

function DefaultLayout({ children }: LayoutProps) {
  return (
    <Sidebar menu={menuRouter}>
      <div className="ml-6"> {children}</div>
    </Sidebar>
  );
}

export default DefaultLayout;
