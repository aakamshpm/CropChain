import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderByID } from "../utils/orderSlice";

const OrderSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");
  const dispatch = useDispatch();

  const {
    orderData: order,
    loading,
    error,
  } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByID(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
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
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between">
              <p className="text-gray-600">Order ID:</p>
              <p className="text-gray-900 font-medium">{order._id}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Order Date:</p>
              <p className="text-gray-900 font-medium">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
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

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Delivery Information
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <LocalShippingIcon className="text-gray-600" />
              <p className="text-gray-600">
                Delivering to:{" "}
                <span className="text-gray-900 font-medium">
                  {order?.address?.houseName}, {order?.address?.street},{" "}
                  {order?.address?.city}, {order?.address?.postalCode}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCardIcon className="text-gray-600" />
              <p className="text-gray-600">
                Payment Method:{" "}
                <span className="text-gray-900 font-medium capitalize">
                  {order.paymentMode}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
