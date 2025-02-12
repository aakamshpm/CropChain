import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import FarmerPublicRoutes from "../farmer/components/routes/FarmerPublicRoutes";
import FarmerProtectedRoutes from "../farmer/components/routes/FarmerProtectedRoutes";
import Login from "../farmer/pages/FarmerLogin";
import Register from "../farmer/pages/FarmerRegister";
import Home from "../farmer/pages/FarmerHome";
import Profile from "../farmer/pages/FarmerProfile";
import Products from "../farmer/pages/FarmerProducts";
import Orders from "../farmer/pages/Orders";
import Verify from "../farmer/pages/Verify";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Farmer Routes */}
      <Route path="/" element={<App />}>
        {/* Farmer Public Routes */}
        <Route element={<FarmerPublicRoutes />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Farmer Protected Routes */}
        <Route element={<FarmerProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="verify" element={<Verify />} />
        </Route>
      </Route>
    </Route>
  )
);
