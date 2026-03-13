import { Navigate } from "react-router-dom";

export default function CisionGuard({ children }) {
  const isAuth = sessionStorage.getItem("cision_auth") === "true";
  return isAuth ? children : <Navigate to="/" replace />;
}
