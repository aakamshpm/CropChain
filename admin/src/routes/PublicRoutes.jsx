import { Navigate, Outlet } from "react-router-dom";
import isAdminAuthenticated from "../../utils/authUtils.js";

const PublicRoutes = () => {
  return isAdminAuthenticated() ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
