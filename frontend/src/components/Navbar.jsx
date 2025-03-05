import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { TextField } from "@mui/material";
import { isUserAuthenticated } from "../utils/userAuth";
import { useDispatch } from "react-redux";
import { clearCartData, getCartDataAsync } from "../utils/cartSlice";
import {
  clearCredentials,
  fetchUserProfile,
  resetMessageState,
  setCredentials,
} from "../utils/userSlice";
import { consumerLogout } from "../utils/actions/consumerActions";
import { retailerLogout } from "../utils/actions/retailerActions";

const Navbar = () => {
  const role = isUserAuthenticated();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const onLogout = async () => {
    try {
      role === "retailer"
        ? await dispatch(retailerLogout()).unwrap()
        : await dispatch(consumerLogout()).unwrap();

      dispatch(resetMessageState());
      dispatch(clearCredentials());
      dispatch(clearCartData());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const searchProducts = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (role) {
        dispatch(getCartDataAsync());
        try {
          const response = await dispatch(fetchUserProfile({ role })).unwrap();
          if (response) {
            const {
              _id,
              firstName,
              lastName,
              phoneNumber,
              profilePicture,
              address,
            } = response;
            dispatch(
              setCredentials({
                role,
                data: {
                  id: _id,
                  firstName,
                  lastName,
                  phoneNumber,
                  profilePicture,
                },
                address,
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
        setSearchTerm("");
      }
    };

    fetchData();
  }, [dispatch, role]);

  return (
    <div className="flex flex-col">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-8 md:px-12 lg:px-20 py-3 sm:py-5 items-center gap-4 sm:gap-0">
        {/* Logo */}
        <Link to="/" className="logo flex items-center">
          <img
            src="/plant.png"
            alt="logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1 className="text-xl sm:text-2xl font-semibold ml-1">CropChain</h1>
        </Link>

        {/* Search Bar */}
        <div className="flex w-full sm:w-auto">
          <div className="border-y-[1px] border-s border-gray-500 rounded-s-lg px-2 sm:px-4 py-1 flex items-center w-full sm:w-[20em]">
            <SearchOutlinedIcon className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
            <TextField
              variant="standard"
              placeholder="Search products"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  searchProducts();
                }
              }}
              slotProps={{
                input: {
                  disableUnderline: true,
                  style: {
                    fontFamily: "Poppins",
                    marginLeft: "4px",
                    fontSize: "0.875rem", // sm:text-base
                  },
                },
              }}
              size="small"
            />
          </div>
          <button
            onClick={searchProducts}
            className="bg-[#00B207] rounded-e-lg text-white px-3 sm:px-4 py-1 text-sm sm:text-base"
          >
            Submit
          </button>
        </div>

        {/* Profile/Auth */}
        <div className="flex items-center">
          {role ? (
            <Link to="/profile" className="flex items-center gap-1 sm:gap-2">
              <Person2OutlinedIcon className="!w-6 !h-6 sm:!w-7 sm:!h-7" />
              <p className="text-sm sm:text-base">
                Profile{" "}
                <span className="text-xs sm:text-sm">
                  ({role.toUpperCase()})
                </span>
              </p>
            </Link>
          ) : (
            <div className="flex gap-1 sm:gap-2 text-sm sm:text-base">
              <Link to="/login">Sign In</Link>
              <span>/</span>
              <Link to="/register">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#F2F2F2] px-4 sm:px-8 md:px-12 lg:px-20 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        {/* Navigation Links */}
        <div className="flex gap-3 sm:gap-5 text-sm sm:text-base">
          <Link to="/">Home</Link>
          {role && <Link to="/my-orders">Orders</Link>}
          <Link to="/farmers">Farmers</Link>
        </div>

        {/* Cart & Logout */}
        {role && (
          <div className="flex gap-3 sm:gap-4">
            <Link to="/cart">
              <ShoppingCartOutlinedIcon className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
            </Link>
            <button onClick={onLogout}>
              <LogoutOutlinedIcon className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
