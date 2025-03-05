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
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Search, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import axios from "axios";

const ViewOrdersToDeliver = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/order/cropchain-orders`,
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
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/update-status`,
        { status: newStatus, orderId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      enqueueSnackbar("Status updated successfully", { variant: "success" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  if (loading) {
    return (
      <div className="flex w-full justify-center items-center h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          CropChain Delivery Orders
        </h1>

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
                <TableCell>Placed By</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
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
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order._id ? null : order._id
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {order._id.slice(-8)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.placedBy?.userId?.firstName +
                        " " +
                        order.placedBy?.userId?.lastName +
                        " (" +
                        order.placedBy?.userType +
                        ")"}
                    </TableCell>
                    <TableCell>
                      {order.farmerId?.firstName +
                        " " +
                        order.farmerId?.lastName || "N/A"}
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
                      {new Date(order.orderDate).toLocaleDateString()}
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
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {expandedOrder === order._id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details */}
                  {expandedOrder === order._id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50">
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-3">
                            Order Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">Products:</p>
                              <ul className="list-disc pl-5">
                                {order.products.map((product, index) => (
                                  <li key={index} className="mb-2">
                                    {product.product?.name} -{product.quantity}
                                    kg @ ₹{product.pricePerKg}/kg
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <p className="font-medium">Delivery Address:</p>
                              <p className="text-gray-600">
                                {order.address?.street}, {order.address?.city}
                                <br />
                                {order.address?.state} -{" "}
                                {order.address?.pincode}
                              </p>

                              <p className="font-medium mt-3">Payment:</p>
                              <p className="text-gray-600">
                                {order.paymentMode} (
                                {order.paymentStatus ? "Paid" : "Unpaid"})
                              </p>
                            </div>
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

export default ViewOrdersToDeliver;
