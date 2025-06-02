import { useState, useEffect } from "react";
import cookie from "js-cookie";

// kiểm tra xem người dùng đăng nhập hay chưa
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = cookie.get("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return isLoggedIn;
}
