import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { logoutFarmer } from "../auth/farmerActions";
import { clearCredentials } from "../auth/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const farmerEndpoint = "/farmer";
  const sidebarOption = [
    {
      path: `${farmerEndpoint}`,
      icon: <HomeOutlinedIcon />,
      name: "Home",
    },
    {
      path: `${farmerEndpoint}/profile`,
      icon: <PersonOutlineOutlinedIcon />,
      name: "Profile",
    },
    {
      path: `${farmerEndpoint}/products`,
      icon: <InventoryOutlinedIcon />,
      name: "Products",
    },
  ];

  const handleLogout = () => {
    try {
      dispatch(clearCredentials());
      dispatch(logoutFarmer());
      navigate("/farmer/login");
    } catch (err) {
      enqueueSnackbar(err || "Logout failed", { variant: "error" });
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-between items-center bg-primary-color p-4 text-white">
        <div className="flex flex-col items-center">
          <header className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Crop Chain</h1>
            <p>-Farmer-</p>
          </header>

          <div className="options flex flex-col mt-10 gap-6">
            {sidebarOption.map(({ path, icon, name }, i) => (
              <Link
                key={i}
                to={path}
                className="flex justify-start items-center gap-2"
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
        <Link onClick={handleLogout}>
          <LogoutOutlinedIcon /> Logout
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
