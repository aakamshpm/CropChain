import { Navigate, Outlet } from "react-router-dom";
import { isRetailerAuthenticated } from "../../utils/retailerAuth";
import Navbar from "../Navbar";

const RetailerProtectedRoutes = () => {
  return isRetailerAuthenticated() ? (
    <div className="flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/retailer/login" />
  );
};

export default RetailerProtectedRoutes;
