import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import UserLogin from "../pages/UserLogin";
import UserRegister from "../pages/UserRegister";
import UserHome from "../pages/UserHome";
import PublicRoute from "../components/routes/PublicRoutes";
import ProductView from "../pages/ProductView";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import OrderHistory from "../pages/OrderHistory";
import ViewFarmers from "../pages/ViewFarmers";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<UserHome />} />
      <Route path="/farmers" element={<ViewFarmers />} />
      <Route path="/product/:id" element={<ProductView />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/my-orders" element={<OrderHistory />} />

      {/* Login and Register restricted to unauthenticated users */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserRegister />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
