import { Navigate, Outlet } from "react-router-dom";
import { isRetailerAuthenticated } from "../../utils/retailerAuth";
import Navbar from "../Navbar";

const RetailerProtectedRoutes = () => {
  return isRetailerAuthenticated() ? (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/retailer/login" />
  );
};

export default RetailerProtectedRoutes;
