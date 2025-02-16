import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderByID } from "../utils/orderSlice";
import { useSnackbar } from "notistack";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const OrderView = () => {
  const { id: orderId } = useParams(); // Get order ID from the URL
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch order details
  const order = useSelector((state) => state.order.orderData);
  const isLoading = useSelector((state) => state.order.isLoading);
  const error = useSelector((state) => state.order.error);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await dispatch(fetchOrderByID(orderId)).unwrap();
      } catch (err) {
        enqueueSnackbar(err.message || "Failed to fetch order details", {
          variant: "error",
        });
      }
    };

    fetchOrder();
  }, [dispatch, orderId, enqueueSnackbar]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No order found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>

        {/* Order Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Order #{order._id}
              </p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {order.status === "Completed" && (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              )}
              {order.status === "Cancelled" && (
                <CancelIcon className="h-5 w-5 text-red-500" />
              )}
              <p
                className={`text-sm font-medium ${
                  order.status === "Completed"
                    ? "text-green-600"
                    : order.status === "Cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
          <div className="space-y-4">
            {order?.products.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                      item.product.images[0]
                    }`}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-gray-900 font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} kg x ₹ {item.pricePerKg}
                    </p>
                  </div>
                </div>
                <p className="text-gray-900 font-medium">
                  ₹ {item.quantity * item.pricePerKg}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Details */}
        {order.farmerId && (
          <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Farmer Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900">
                <span className="font-medium">Name:</span> {order.farmerId.name}
              </p>
              <p className="text-gray-900">
                <span className="font-medium">Email:</span>{" "}
                {order.farmerId.email}
              </p>
              <p className="text-gray-900">
                <span className="font-medium">Phone:</span>{" "}
                {order.farmerId.phone}
              </p>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Total Amount:</p>
              <p className="text-gray-900 font-medium">₹ {order.totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Payment Mode:</p>
              <p className="text-gray-900 font-medium capitalize">
                {order.paymentMode}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Payment Status:</p>
              <p
                className={`font-medium ${
                  order.paymentStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.paymentStatus ? "Paid" : "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Information
          </h2>
          <div className="flex items-center space-x-2">
            <LocalShippingIcon className="h-5 w-5 text-gray-600" />
            <p className="text-gray-600">
              Delivering to:{" "}
              <span className="text-gray-900 font-medium">
                {order.address.houseName}, {order.address.street},{" "}
                {order.address.city}, {order.address.postalCode}
              </span>
            </p>
          </div>
        </div>

        {/* Back to Orders Link */}
        <div className="mt-6">
          <Link
            to="/my-orders"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
