import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import PublicRoutes from "../farmer/components/routes/PublicRoutes";
import ProtectedRoutes from "../farmer/components/routes/ProtectedRoutes";
import FarmerApp from "../farmer/FarmerApp";
import Login from "../farmer/pages/Login";
import Register from "../farmer/pages/Register";
import Home from "../farmer/pages/Home";
import Profile from "../farmer/pages/Profile";
import Products from "../farmer/pages/Products";
import AddProduct from "../farmer/pages/AddProduct";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Farmer Routes  */}
      <Route path="farmer" element={<FarmerApp />}>
        {/* Protected Routes  */}
        <Route element={<PublicRoutes />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="add-products" element={<AddProduct />} />
        </Route>
      </Route>
    </Route>
  )
);
