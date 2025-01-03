import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../auth/authUtils";
import Sidebar from "../Sidebar";

const ProtectedRoutes = () => {
  return isAuthenticated() ? (
    <div className="layout">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/farmer/login" />
  );
};

export default ProtectedRoutes;
