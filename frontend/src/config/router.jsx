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
import UserApp from "../user/UserApp";
import UserLogin from "../user/pages/UserLogin";
import UserRegister from "../user/pages/UserRegister";
import UserHome from "../user/pages/UserHome";
import Orders from "../farmer/pages/Orders";
import Transactions from "../farmer/pages/Transactions";
import PublicRoute from "../user/components/routes/PublicRoutes";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* User Routes */}
      <Route element={<UserApp />}>
        {/* Public Routes */}
        <Route index element={<UserHome />} />

        {/* Login and Register restricted to unauthenticated users */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<UserLogin />} />
          <Route path="register" element={<UserRegister />} />
        </Route>
      </Route>

      {/* Farmer Routes */}
      <Route path="farmer" element={<FarmerApp />}>
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
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Route>
    </Route>
  )
);
