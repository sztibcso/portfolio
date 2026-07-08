import { Navigate } from "react-router-dom";

export default function TecnomatixGuard({ children }) {
  const isAuth = sessionStorage.getItem("tecnomatix_auth") === "true";
  return isAuth ? children : <Navigate to="/" replace />;
}
