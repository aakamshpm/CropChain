import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../auth/authUtils";

const FarmerPublicRoutes = () => {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />;
};

export default FarmerPublicRoutes;
