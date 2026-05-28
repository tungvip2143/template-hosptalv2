import { APP_CONFIG } from "@src/app.config";

export const PUBLIC_ROUTER = {
  HOME: "/",
  SITE_SELECTION: "/site-selection",
  SIGN_IN: "/sign-in",
  DEFAULT_PAGE: {
    LIST: APP_CONFIG.defaultRoute,
  },
};
