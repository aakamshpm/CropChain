import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import PublicRoutes from "../farmer/components/routes/PublicRoutes";
import ProtectedRoutes from "../farmer/components/routes/ProtectedRoutes";
import FarmerApp from "../FarmerApp";
import Login from "../farmer/pages/Login";
import Register from "../farmer/pages/Register";
import Home from "../farmer/pages/Home";
import Profile from "../farmer/pages/Profile";

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
        </Route>
      </Route>
    </Route>
  )
);
