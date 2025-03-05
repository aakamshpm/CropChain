import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder, fetchOrderByID } from "../utils/orderSlice";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const OrderView = () => {
  const { id: orderId } = useParams(); // Get order ID from URL
  const dispatch = useDispatch();
  const {
    orderData: order,
    loading,
    error,
  } = useSelector((state) => state.order);

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderByID(orderId));
  }, [dispatch, orderId]);

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await dispatch(cancelOrder(selectedOrderId)).unwrap();
      enqueueSnackbar("Order cancelled", { variant: "success" });
      dispatch(fetchOrderByID(orderId)); // Refetch order details
      setOpenCancelDialog(false);
    } catch (err) {
      enqueueSnackbar("Failed to cancel order", { variant: "error" });
    }
  };

  const handleCancelClose = () => {
    setOpenCancelDialog(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-28">
      {/* Back Button */}
      <Link
        to="/my-orders"
        className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
      >
        <ArrowBackIcon className="mr-2" />
        Back to Orders
      </Link>

      {/* Order Summary */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order #{order._id}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <strong>Order Date:</strong>{" "}
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Status:</strong>{" "}
              <span
                className={`font-medium ${
                  order.status === "Completed"
                    ? "text-green-600"
                    : order.status === "Cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Delivery Option:</strong>{" "}
              {order.deliveryOption === "cropChain"
                ? "CropChain Delivery"
                : "Self-Managed Delivery"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Delivery Charge:</strong> ₹ {order.deliveryCharge}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Total Amount:</strong> ₹ {order.totalAmount}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Payment Mode:</strong> {order.paymentMode}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Payment Status:</strong>{" "}
              <span
                className={`font-medium ${
                  order.paymentStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.paymentStatus ? "Paid" : "Pending"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
        {order?.products?.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 mb-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                    item?.product?.images?.[0] || "default-image.jpg"
                  }`}
                  alt={item?.product?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="text-gray-900 font-medium">
                    {item?.product?.name || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {item?.product?.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-gray-600">
                  <strong>Quantity:</strong> {item?.quantity || 0} kg
                </p>

                <p className="text-gray-600">
                  <strong>Total:</strong> ₹ {item.price || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Farmer Information */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Farmer Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <strong>Name:</strong>{" "}
              {order?.farmerId?.firstName + " " + order?.farmerId?.lastName ||
                "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Farm Name:</strong> {order?.farmerId?.farmName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Farm Location:</strong>{" "}
              {order?.farmerId?.farmLocation?.latitude || "N/A"},{" "}
              {order?.farmerId?.farmLocation?.longitude || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Contact:</strong> {order?.farmerId?.phoneNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Delivery Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <strong>Full Name:</strong>{" "}
              {`${order?.address?.firstName || ""} ${
                order?.address?.lastName || ""
              }`.trim() || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>House Name:</strong> {order?.address?.houseName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Street:</strong> {order?.address?.street || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>City:</strong> {order?.address?.city || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Postal Code:</strong>{" "}
              {order?.address?.postalCode || "N/A"}
            </p>
          </div>
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

export default OrderView;
