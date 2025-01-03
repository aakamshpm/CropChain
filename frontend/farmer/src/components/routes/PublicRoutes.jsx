import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../auth/authUtils";

const PublicRoutes = () => {
  return isAuthenticated() ? <Navigate to="/farmer" /> : <Outlet />;
};

export default PublicRoutes;
