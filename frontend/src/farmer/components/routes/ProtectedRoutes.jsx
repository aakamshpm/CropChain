import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../auth/authUtils";
import Sidebar from "../Sidebar";

const ProtectedRoutes = () => {
  return isAuthenticated() ? (
    <div className="flex">
      <Sidebar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/farmer/login" />
  );
};

export default ProtectedRoutes;
