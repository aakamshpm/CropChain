import { useGetUserOrdersQuery } from "../utils/userServices";
import { Link } from "react-router-dom";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { cancelOrder } from "../utils/orderSlice";
import { useSnackbar } from "notistack";

const OrderHistory = () => {
  const { data: orders, isLoading, isError, refetch } = useGetUserOrdersQuery();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await dispatch(cancelOrder(selectedOrderId)).unwrap();

      enqueueSnackbar("Order cancelled", { variant: "success" });
      refetch();
      setOpenCancelDialog(false);
    } catch (err) {
      enqueueSnackbar("Failed to cancel order", { variant: "error" });
    }
  };

  const handleCancelClose = () => {
    setOpenCancelDialog(false);
  };

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

        <div className="space-y-6">
          {orders.orders.map((order) => (
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

              {/* Delivery Information */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
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

              {/* Cancel Button */}
              {order.status === "Pending" && order.paymentMode === "cod" && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelClick(order._id)}
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCancelClose}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="primary">
            No, Keep Order
          </Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderHistory;
