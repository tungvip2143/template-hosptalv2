import { ReactNode } from "react";
import { ConfigProvider as AntdConfigProvider } from "@pnkx-lib/ui";
import { createCache, StyleProvider } from "@ant-design/cssinjs";

interface AppConfigProviderProps {
  children: ReactNode;
}

const cache = createCache();
export const AppConfigProvider = ({ children }: AppConfigProviderProps) => {
  return (
    <StyleProvider hashPriority="high" cache={cache}>
      <AntdConfigProvider
        theme={{
          cssVar: true,
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
    </StyleProvider>
  );
};
