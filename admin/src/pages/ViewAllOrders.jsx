import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Search, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";

const ViewAllOrders = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/order/all`,
          { withCredentials: true }
        );
        setOrders(response.data.orders);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch orders";
        enqueueSnackbar(errorMessage, { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/update-status`,
        { status: newStatus, orderId },
        { withCredentials: true }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      enqueueSnackbar("Order status updated successfully", {
        variant: "success",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.placedBy.userId?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.farmerId?.farmName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Orders</h1>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <TextField
            variant="outlined"
            placeholder="Search orders..."
            InputProps={{
              startAdornment: <Search className="text-gray-500 mr-2" />,
            }}
            className="bg-white rounded-lg flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white w-full sm:w-48"
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </div>

        {/* Orders Table */}
        <TableContainer component={Paper} className="shadow-lg rounded-xl">
          <Table>
            <TableHead className="bg-green-100">
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((order) => (
                <>
                  <TableRow
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(order._id)}
                  >
                    <TableCell className="font-medium">
                      {order._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {order.placedBy.userId
                        ? `${order.placedBy.userId.firstName} ${order.placedBy.userId.lastName}`
                        : "Deleted User"}
                      <br />
                      <span className="text-xs text-gray-500">
                        ({order.placedBy.userType})
                      </span>
                    </TableCell>
                    <TableCell>
                      {order.farmerId
                        ? `${order.farmerId.firstName} ${order.farmerId.lastName}`
                        : "Deleted Farmer"}
                      <br />
                      <span className="text-xs text-gray-500">
                        {order.farmerId?.farmName}
                      </span>
                    </TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "Completed"
                            ? "success"
                            : order.status === "Cancelled"
                            ? "error"
                            : "warning"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {moment(order.deliveryDate).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>
                      {moment(order.orderDate).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        size="small"
                        className="w-32"
                        disabled={order.status === "Completed"}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Completed">Complete</MenuItem>
                        <MenuItem value="Cancelled">Cancel</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        {expandedOrder === order._id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details */}
                  {expandedOrder === order._id && (
                    <TableRow>
                      <TableCell colSpan={9} className="bg-gray-50">
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">Products</h3>
                            <ul className="space-y-2">
                              {order.products.map((product, index) => (
                                <li key={index} className="text-sm">
                                  {product.product?.name} - {product.quantity}kg
                                  <br />@ ₹{product.pricePerKg}/kg
                                  <br />
                                  <span className="text-gray-500">
                                    Category: {product.product?.category}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">
                              Delivery Details
                            </h3>
                            <p className="text-sm">
                              {order.address?.street}
                              <br />
                              {order.address?.city}, {order.address?.state} -{" "}
                              {order.address?.pincode}
                            </p>
                            <p className="mt-2 text-sm">
                              <span className="font-medium">
                                Delivery Option:
                              </span>{" "}
                              {order.deliveryOption === "cropChain"
                                ? "CropChain Managed"
                                : "Self Managed"}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Contact:</span>{" "}
                              {order.address?.contactNumber || "Not provided"}
                            </p>
                            <p className="text-sm mt-2">
                              <span className="font-medium">
                                Payment Status:
                              </span>{" "}
                              {order.paymentStatus ? "Paid" : "Unpaid"} (
                              {order.paymentMode})
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No orders found matching your criteria
            </div>
          )}
        </TableContainer>
      </div>
    </div>
  );
};

export default ViewAllOrders;
