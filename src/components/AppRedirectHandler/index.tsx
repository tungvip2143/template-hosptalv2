import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const AppRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Nếu đang ở trang chủ "/", tự động chuyển sang "/danh-muc"
    if (location.pathname === "/") {
      navigate("", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null; // Không render gì
};

export default AppRedirectHandler;
