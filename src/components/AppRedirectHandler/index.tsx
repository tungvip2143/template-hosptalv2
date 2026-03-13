import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const AppRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null; // Không render gì
};

export default AppRedirectHandler;
