import { Navigate, Outlet } from "react-router-dom";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { isAuthenticated } from "../../auth/authUtils";
import Sidebar from "../Sidebar";
import { useState } from "react";

const FarmerProtectedRoutes = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return isAuthenticated() ? (
    <div className={`layout ${isMobileSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Mobile Toggle Button */}
      <button
        className="fixed lg:hidden z-50 top-4 left-4 p-2 bg-primary-color rounded-full text-white"
        onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div className="sidebar">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default FarmerProtectedRoutes;
