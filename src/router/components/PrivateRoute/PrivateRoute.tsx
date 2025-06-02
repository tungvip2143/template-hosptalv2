import { useAuth } from "@src/hook/useAuth";
import { Navigate } from "react-router";

// check authen
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/dang-nhap" replace />;
};

export default PrivateRoute;
