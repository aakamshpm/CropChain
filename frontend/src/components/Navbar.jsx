import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { TextField } from "@mui/material";
import { isUserAuthenticated } from "../utils/userAuth";
import { useDispatch } from "react-redux";
import { clearCartData, getCartDataAsync } from "../utils/cartSlice";
import { clearCredentials } from "../utils/userSlice";
import { consumerLogout } from "../utils/actions/consumerActions";
import { retailerLogout } from "../utils/actions/retailerActions";

const Navbar = () => {
  const role = isUserAuthenticated();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    {
      role === "retailer"
        ? dispatch(retailerLogout())
        : dispatch(consumerLogout());
    }
    dispatch(clearCredentials());
    dispatch(clearCartData());
    navigate("/login");
  };

  useEffect(() => {
    if (role) dispatch(getCartDataAsync());
  }, [dispatch, role]);

  return (
    <div className="flex flex-col ">
      <div className="flex justify-between px-20 py-5 items-center">
        <Link to="/" className="logo flex items-center justify-between">
          <img src="/plant.png" alt="logo" />
          <h1 className=" text-2xl font-semibold ml-1">CropChain</h1>
        </Link>

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
          {role ? (
            <>
              <Person2OutlinedIcon sx={{ fontSize: 30 }} />
              <p className="text-lg ">
                Profile <span>({role.toUpperCase()})</span>
              </p>
            </>
          ) : (
            <div>
              <p className="flex">
                <Link to="/login">Sign In</Link>
                <span className="ml-1 mr-1">/</span>
                <Link to="/register"> Sign Up</Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#F2F2F2] px-20 py-3 flex justify-between items-center">
        <div className="flex justify-between gap-5">
          <Link to="/">Home</Link>
          <Link to="/my-orders">Orders</Link>
          <Link to="/farmers">Farmers</Link>
        </div>

        <div className="flex justify-between gap-4">
          <Link to="/cart">
            <ShoppingCartOutlinedIcon />
          </Link>
          <button onClick={onLogout}>
            <LogoutOutlinedIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
