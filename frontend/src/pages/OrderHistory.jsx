import { useGetUserOrdersQuery } from "../utils/userServices";
import { Link } from "react-router-dom";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";

const OrderHistory = () => {
  const { data: orders, isLoading, isError, refetch } = useGetUserOrdersQuery();
  const [sortOrder, setSortOrder] = useState("latest"); // State for sorting

  const { enqueueSnackbar } = useSnackbar();

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Sort orders based on the selected option
  const sortedOrders = orders?.orders
    ? [...orders.orders].sort((a, b) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
      })
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">
          Failed to load orders. Please try again later.
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No orders found.</p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Sort Dropdown */}
        <div className="mb-6">
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="latest">Latest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 sm:p-8"
            >
              {/* Order Header */}
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

              {/* Products List */}
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Products
                </h2>
                <div className="space-y-4">
                  {order.products.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={`${
                            import.meta.env.VITE_API_SERVER_URL
                          }/uploads/${item.product.images[0]}`}
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

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Total Amount:</p>
                  <p className="text-gray-900 font-medium">
                    ₹ {order.totalAmount}
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

              {/* Link to Detailed Order Page */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to={`/my-orders/${order._id}`}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
