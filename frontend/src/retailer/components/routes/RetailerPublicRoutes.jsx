import { Navigate, Outlet } from "react-router-dom";
import { isRetailerAuthenticated } from "../../utils/retailerAuth";

const RetailerPublicRoutes = () => {
  return isRetailerAuthenticated() ? <Navigate to="/retailer" /> : <Outlet />;
};

export default RetailerPublicRoutes;
