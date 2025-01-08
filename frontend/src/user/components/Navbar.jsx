import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { TextField } from "@mui/material";

const Navbar = () => {
  return (
    <div className="flex flex-col font-['Poppins']">
      <div className="flex justify-between px-20 py-5 items-center">
        <div className="logo flex items-center justify-between">
          <img src="/plant.png" alt="logo" />
          <h1 className=" text-2xl font-semibold ml-1">CropChain</h1>
        </div>

        <div className="flex">
          <div className="border-y-[1px] border-s border-gray-500 rounded-s-lg px-4 py-1 flex items-center w-[25em]">
            <SearchOutlinedIcon />
            <TextField
              variant="standard"
              placeholder="Search"
              fullWidth
              slotProps={{
                input: {
                  disableUnderline: true,
                  style: { fontFamily: "Poppins" },
                },
              }}
            />
          </div>
          <button className="bg-[#00B207] rounded-e-lg text-white px-4 py-1">
            Submit
          </button>
        </div>

        <div className="flex items-center">
          <Person2OutlinedIcon sx={{ fontSize: 30 }} />
          <p className="text-lg ">Profile</p>
        </div>
      </div>

      <div className="bg-[#F2F2F2] px-20 py-3 flex justify-between items-center">
        <div className="flex justify-between gap-5">
          <Link to="#">Home</Link>
          <Link to="#">Orders</Link>
          <Link to="#">Farmers</Link>
        </div>

        <div className="flex justify-between gap-4">
          <ShoppingCartOutlinedIcon />
          <LogoutOutlinedIcon />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
