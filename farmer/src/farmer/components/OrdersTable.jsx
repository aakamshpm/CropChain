import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import moment from "moment";
import {
  Box,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeOrderStatusAsync } from "../auth/orderActions";
import { enqueueSnackbar } from "notistack";

const OrdersTable = ({ orders }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");

  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log(orders);
  useEffect(() => {
    if (orders) setOrderStatus(orders.status);
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    {
      field: "orderDate",
      headerName: "Ordered Date",
      width: 240,
      valueGetter: (value) => moment(value).format("MMMM Do YYYY, h:mm:ss A"),
    },
    {
      field: "userType",
      headerName: "User type",
      width: 150,
      valueGetter: (_, row) => row.placedBy.userType,
    },
    {
      field: "totalProducts",
      headerName: "Total Products",
      type: "number",
      width: 130,
      valueGetter: (_, row) => row.products.length,
    },
    {
      field: "totalAmount",
      headerName: "Amount",
      type: "number",
      width: 110,
    },
    {
      field: "paymentStatus",
      headerName: "Payment status",
      width: 140,
    },
  ];
  const paginationModel = { page: 0, pageSize: 5 };

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOrderStatus = (e) => {
    try {
      dispatch(
        changeOrderStatusAsync({
          status: e.target.value,
          orderId: selectedRow._id,
        })
      );
      setOrderStatus(e.target.value);
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <div className="p-5 h-screen">
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowClick={handleRowClick}
          sx={{ border: 0, cursor: "pointer", outline: "none" }}
        />
      </Paper>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Order Details
          </Typography>
          {selectedRow && (
            <div>
              {/* Order Information */}
              <div>
                <Typography variant="subtitle1" fontWeight="bold">
                  General Information
                </Typography>
                <p>
                  <strong>Order ID:</strong> {selectedRow._id}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {moment(selectedRow.orderDate).format(
                    "MMMM Do YYYY, h:mm:ss A"
                  )}
                </p>
                <p>
                  <strong>Status:</strong> {orderStatus}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedRow.paymentStatus ? "Paid" : "Unpaid"}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${selectedRow.totalAmount}
                </p>
              </div>

              {/* Address Section */}
              <div style={{ marginTop: "20px" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Address
                </Typography>
                <p>
                  <strong>Name:</strong> {selectedRow.address.firstName}{" "}
                  {selectedRow.address.lastName}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedRow.address.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {`${selectedRow.address.houseName}, ${selectedRow.address.street}, ${selectedRow.address.city}, ${selectedRow.address.postalCode}`}
                </p>
              </div>

              {/* Product Information */}
              <div style={{ marginTop: "20px" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Products
                </Typography>
                {selectedRow.products.map((item, index) => (
                  <Box
                    key={item.product._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      mb: 1,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <img
                        src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                          item.product.images[0]
                        }`}
                        alt={item.product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "5px",
                        }}
                      />
                      <div>
                        <p>
                          <strong>{item.product.name}</strong>
                        </p>
                        <p>
                          <strong>Category:</strong> {item.product.category}
                        </p>
                      </div>
                    </Box>
                    <div>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹ {item.pricePerKg}/kg
                      </p>
                    </div>
                  </Box>
                ))}
              </div>

              {/* Order Status Update */}
              <div style={{ marginTop: "20px" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Update Status
                </Typography>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={orderStatus}
                    name="radio-buttons-group"
                    onChange={handleOrderStatus}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel
                      value="Pending"
                      control={<Radio />}
                      label="Pending"
                    />
                    <FormControlLabel
                      value="Completed"
                      control={<Radio />}
                      label="Completed"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default OrdersTable;
