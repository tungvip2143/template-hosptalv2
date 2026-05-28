import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { APP_CONFIG } from "@src/app.config";

const AppRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate(APP_CONFIG.defaultRoute, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

export default AppRedirectHandler;
