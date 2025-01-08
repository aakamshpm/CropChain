import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import FarmerPublicRoutes from "../farmer/components/routes/FarmerPublicRoutes";
import FarmerProtectedRoutes from "../farmer/components/routes/FarmerProtectedRoutes";
import FarmerApp from "../farmer/FarmerApp";
import Login from "../farmer/pages/FarmerLogin";
import Register from "../farmer/pages/FarmerRegister";
import Home from "../farmer/pages/FarmerHome";
import Profile from "../farmer/pages/FarmerProfile";
import Products from "../farmer/pages/FarmerProducts";
import RetailerApp from "../retailer/RetailerApp";
import RetailerLogin from "../retailer/pages/RetailerLogin";
import RetailerRegister from "../retailer/pages/RetailerRegister";
import RetailerHome from "../retailer/pages/RetailerHome";
import RetailerPublicRoutes from "../retailer/components/routes/RetailerPublicRoutes";
import RetailerProtectedRoutes from "../retailer/components/routes/RetailerProtectedRoutes";
import Orders from "../farmer/pages/Orders";
import Transactions from "../farmer/pages/Transactions";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Farmer Routes  */}
      <Route path="farmer" element={<FarmerApp />}>
        {/* Public Routes  */}
        <Route element={<FarmerPublicRoutes />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<FarmerProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Route>

      {/* Retailer Routes  */}
      <Route path="retailer" element={<RetailerApp />}>
        {/* Public Routes  */}
        <Route element={<RetailerPublicRoutes />}>
          <Route path="login" element={<RetailerLogin />} />
          <Route path="register" element={<RetailerRegister />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<RetailerProtectedRoutes />}>
          <Route index element={<RetailerHome />} />
        </Route>
      </Route>
    </Route>
  )
);
