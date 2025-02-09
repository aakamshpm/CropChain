import { Navigate, Outlet } from "react-router-dom";
import isAdminAuthenticated from "../../utils/authUtils";
import SideBar from "../components/SideBar";

const PrivateRoutes = () => {
  return isAdminAuthenticated() ? (
    <div className="flex h-screen">
      <SideBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
