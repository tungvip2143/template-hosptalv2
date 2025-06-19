import { ReactNode } from "react";
import { ConfigProvider as AntdConfigProvider } from "@pnkx-lib/ui";

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  return (
    <AntdConfigProvider
      theme={{
        components: {
          Modal: {
            wireframe: true,
          },
          Table: {
            cellPaddingBlockSM: 6,
          },
        },
      }}
    >
      {children}
    </AntdConfigProvider>
  );
};
