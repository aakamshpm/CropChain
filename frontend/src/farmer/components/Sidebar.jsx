import React from "react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AddchartOutlinedIcon from "@mui/icons-material/AddchartOutlined";

const Sidebar = () => {
  const basePath = "/farmer";
  const sidebarOption = [
    {
      path: `${basePath}`,
      icon: <HomeOutlinedIcon />,
      name: "Home",
    },
    {
      path: `${basePath}/profile`,
      icon: <PersonOutlineOutlinedIcon />,
      name: "Profile",
    },
    {
      path: `${basePath}/products`,
      icon: <InventoryOutlinedIcon />,
      name: "Products",
    },
    {
      path: `${basePath}/add-products`,
      icon: <AddchartOutlinedIcon />,
      name: "Add Products",
    },
  ];

  return (
    <>
      <div className="h-screen flex flex-col items-center bg-primary-color p-4 text-white">
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
    </>
  );
};

export default Sidebar;
