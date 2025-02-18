import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import { logoutFarmer } from "../auth/farmerActions";
import { clearCredentials, setCredentials } from "../auth/authSlice";
import { useGetFarmerDetailsQuery } from "../auth/authService";
import { useEffect } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { data } = useGetFarmerDetailsQuery();

  const sidebarOption = [
    {
      path: "/",
      icon: <HomeOutlinedIcon />,
      name: "Home",
    },
    {
      path: `/profile`,
      icon: <PersonOutlineOutlinedIcon />,
      name: "Profile",
    },
    {
      path: `/products`,
      icon: <InventoryOutlinedIcon />,
      name: "Products",
    },
    {
      path: `/orders`,
      icon: <ChecklistRtlOutlinedIcon />,
      name: "Orders",
    },
    {
      path: `/verify`,
      icon: <AssignmentTurnedInOutlinedIcon />,
      name: "Verify",
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
          name: data.data.name,
          phoneNumber: data.data.phoneNumber,
          city: data.data.city,
        })
      );
    }
  }, [data]);

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
        <button onClick={handleLogout}>
          <LogoutOutlinedIcon /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
