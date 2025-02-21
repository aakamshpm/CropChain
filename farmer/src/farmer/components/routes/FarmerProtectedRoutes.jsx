import { Navigate, Outlet } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { isAuthenticated } from "../../auth/authUtils";
import Sidebar from "../Sidebar";

const FarmerProtectedRoutes = () => {
  return isAuthenticated() ? (
    <div className="layout">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <Outlet />
        </SnackbarProvider>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default FarmerProtectedRoutes;
