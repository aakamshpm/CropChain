import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import {
  HomeOutlined,
  PersonOutlineOutlined,
  InventoryOutlined,
  LogoutOutlined,
  ChecklistRtlOutlined,
  AssignmentTurnedInOutlined,
  MenuBookOutlined,
} from "@mui/icons-material";

import { logoutFarmer } from "../auth/farmerActions";
import { clearCredentials, setCredentials } from "../auth/authSlice";
import { useGetFarmerDetailsQuery } from "../auth/authService";
import { useEffect } from "react";

const Sidebar = ({ isMobileSidebarOpen, setMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetFarmerDetailsQuery();

  const sidebarOption = [
    { path: "/", icon: <HomeOutlined />, name: "Home" },
    { path: "/profile", icon: <PersonOutlineOutlined />, name: "Profile" },
    { path: "/products", icon: <InventoryOutlined />, name: "Products" },
    { path: "/orders", icon: <ChecklistRtlOutlined />, name: "Orders" },
    { path: "/verify", icon: <AssignmentTurnedInOutlined />, name: "Verify" },
    {
      path: "/farmer-guide",
      icon: <MenuBookOutlined />,
      name: "Guidance",
    },
  ];

  const handleLogout = () => {
    try {
      dispatch(clearCredentials());
      dispatch(logoutFarmer());
      navigate("/login");
    } catch (err) {
      enqueueSnackbar(err || "Logout failed", { variant: "error" });
    }
  };

  useEffect(() => {
    if (data?.data) {
      dispatch(
        setCredentials({
          id: data.data._id,
          name: data.data.firstName + " " + data.data.lastName,
          phoneNumber: data.data.phoneNumber,
          city: data.data.city,
        })
      );
    }
  }, [data, dispatch]);

  return (
    <>
      <div
        className={`fixed lg:relative h-screen flex flex-col justify-between items-center bg-primary-color p-4 text-white transition-transform duration-300
          ${
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        style={{ width: "230px", zIndex: 40 }}
      >
        <div className="flex flex-col items-center w-full">
          <header className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Crop Chain</h1>
            <p>-Farmer-</p>
          </header>

          <div className="options flex flex-col mt-10 gap-6 w-full">
            {sidebarOption.map(({ path, icon, name }, i) => (
              <Link
                key={i}
                to={path}
                className="flex justify-start items-center gap-2 p-2 hover:bg-white/10 rounded-lg"
                onClick={() => setMobileSidebarOpen(false)}
              >
                {React.cloneElement(icon, {
                  fontSize: "large",
                  className: "bg-white rounded-full p-1 text-black",
                })}
                <p className="text-lg font-medium">{name}</p>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg w-full"
        >
          <LogoutOutlined />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
