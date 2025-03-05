import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useGetProductsQuery } from "../utils/userServices";
import { isValidPhoneNumber } from "react-phone-number-input";
import { placeOrderAsync } from "../utils/orderSlice";
import { clearCartData } from "../utils/cartSlice";

const Checkout = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  const { cartItems, cartFarmerId } = useSelector((state) => state.cart);
  const { userData, address } = useSelector((state) => state.user);
  const { role } = useSelector((state) => state.user);

  const [deliveryOption, setDeliveryOption] = useState("selfManaged");

  const { enqueueSnackbar } = useSnackbar();
  const [paymentMode, setPaymentMode] = useState("cod");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value) =>
        isValidPhoneNumber(value)
      ),
    houseName: Yup.string().required("House name is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    postalCode: Yup.string().required("Postal code is required"),
  });

  useEffect(() => {
    if (cartItems && Object.keys(cartItems).length === 0) {
      navigate("/cart");
    }
  }, []);

  const getTotalCartAmount = () => {
    let total = 0;
    for (const productId in cartItems) {
      const product = products?.data.find((item) => item._id === productId);
      if (product) {
        // Calculate price based on user role
        const price =
          role === "retailer" && product.retailerPrice
            ? product.retailerPrice
            : product.pricePerKg;

        total +=
          role === "retailer" && product.retailerPrice
            ? (cartItems[productId] * price) / 100
            : cartItems[productId] * price;
      }
    }
    return total;
  };

  // Calculate delivery charge
  const deliveryCharge = deliveryOption === "cropChain" ? 40 : 0;

  const placeOrder = async (formAddress) => {
    let orderedProducts = [];
    let calculatedTotal = 0;

    products?.data.forEach((product) => {
      if (cartItems[product._id] > 0) {
        // Determine the correct price to use
        const price =
          role === "retailer" && product.retailerPrice
            ? product.retailerPrice
            : product.pricePerKg;

        const itemTotal =
          role === "retailer" && product.retailerPrice
            ? (cartItems[product._id] * price) / 100
            : cartItems[product._id] * price;
        calculatedTotal += itemTotal;

        orderedProducts.push({
          product: product._id,
          quantity: cartItems[product._id],
          price: itemTotal,
        });
      }
    });

    const orderData = {
      farmerId: cartFarmerId,
      products: orderedProducts,
      paymentMode,
      address: formAddress,
      deliveryOption,
      deliveryCharge,
      totalAmount: calculatedTotal,
    };

    try {
      const orderResponse = await dispatch(placeOrderAsync(orderData)).unwrap();

      if (!orderResponse) {
        throw new Error("Order response is undefined or invalid");
      }

      if (paymentMode === "cod") {
        enqueueSnackbar(orderResponse?.message || "Order placed successfully", {
          variant: "success",
        });
        navigate(`/order-success?orderId=${orderResponse?.orderId}`);
        dispatch(clearCartData());
      } else {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderResponse?.amount * 100, // Amount in paise
          currency: orderResponse?.currency,
          name: "CropChain BANK",
          description: "Test Transaction",
          order_id: orderResponse?.razorpayOrderId, // Pass Razorpay order ID
          handler: async function (response) {
            const paymentData = {
              orderId: orderResponse?.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            try {
              await axios.post(
                `${
                  import.meta.env.VITE_API_SERVER_URL
                }/api/order/verify-payment`,
                paymentData,
                { withCredentials: true }
              );
              enqueueSnackbar("Payment verified successfully", {
                variant: "success",
              });
              dispatch(clearCartData());
              navigate(`/order-success?orderId=${orderResponse?.orderId}`);
            } catch (err) {
              enqueueSnackbar(
                err?.response?.data?.message || "Payment verification failed",
                {
                  variant: "error",
                }
              );
              console.error(err);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment failed:", response);
          enqueueSnackbar("Payment failed. Please try again.", {
            variant: "error",
          });
        });
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err?.message || "Order placement failed", {
        variant: "error",
      });
    }
  };

  return (
    <div className="h-[50em] px-28 py-5">
      <div className="flex w-full justify-center gap-10 mt-3">
        <div className="flex flex-col gap-3 h-full">
          <h2 className="text-2xl font-semibold ">Billing Information</h2>
          <Formik
            initialValues={{
              firstName: userData?.firstName || "",
              lastName: userData?.lastName || "",
              phoneNumber: userData?.phoneNumber || "",
              houseName: address?.houseName || "",
              street: address?.street || "",
              city: address?.city || "",
              postalCode: address?.postalCode || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => placeOrder(values)}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  <div className="flex flex-col">
                    <label>First Name</label>
                    <TextField
                      fullWidth
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={<ErrorMessage name="firstName" />}
                    />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <TextField
                      fullWidth
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={<ErrorMessage name="lastName" />}
                    />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <TextField
                      fullWidth
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={<ErrorMessage name="phoneNumber" />}
                    />
                  </div>
                </div>
                <Box className="grid grid-cols-3 gap-4">
                  <div>
                    <label>House name</label>
                    <TextField
                      fullWidth
                      name="houseName"
                      value={values.houseName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.houseName && Boolean(errors.houseName)}
                      helperText={<ErrorMessage name="houseName" />}
                    />
                  </div>
                  <div>
                    <label>Street</label>
                    <TextField
                      fullWidth
                      name="street"
                      value={values.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.street && Boolean(errors.street)}
                      helperText={<ErrorMessage name="street" />}
                    />
                  </div>
                  <div>
                    <label>City</label>
                    <TextField
                      fullWidth
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.city && Boolean(errors.city)}
                      helperText={<ErrorMessage name="city" />}
                    />
                  </div>
                  <div>
                    <label>Postal code</label>
                    <TextField
                      fullWidth
                      name="postalCode"
                      value={values.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.postalCode && Boolean(errors.postalCode)}
                      helperText={<ErrorMessage name="postalCode" />}
                    />
                  </div>
                </Box>

                <button id="place-order" type="submit" className="hidden" />
              </Form>
            )}
          </Formik>
        </div>

        {/* Order Summary Section */}
        <div className="border-[1px] border-[#808080] rounded-md p-5 min-w-[40%] flex flex-col lg:min-w-[30%]">
          <div className="flex flex-col">
            <h2>Order Summary</h2>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {products?.data.map((product, i) => {
                  if (cartItems[product._id] > 0) {
                    const price =
                      role === "retailer" && product.retailerPrice
                        ? product.retailerPrice
                        : product.pricePerKg;

                    const itemTotal =
                      role === "retailer" && product.retailerPrice
                        ? (cartItems[product._id] * price) / 100
                        : cartItems[product._id] * price;
                    return (
                      <div
                        key={i}
                        className="flex justify-between w-full items-center"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            className="w-14"
                            src={`${
                              import.meta.env.VITE_API_SERVER_URL
                            }/uploads/${product.images[0]}`}
                            alt=""
                          />
                          <p className="text-base">{product.name}</p>
                          <p className="text-base font-semibold">
                            {" "}
                            x{cartItems[product._id]}
                          </p>
                        </div>
                        <p className="text-base font-medium">₹ {itemTotal}</p>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex justify-between">
              <p className="text-gray-800">SubTotal: </p>
              <p className="text-gray-800 font-semibold">
                ₹ {getTotalCartAmount()}.00
              </p>
            </div>

            <div className="w-full h-[1px] bg-[#808080] opacity-35" />

            {/* Delivery Options */}
            <div className="mt-2">
              <h3 className="font-semibold text-lg mb-2">Delivery Method</h3>
              <FormControl fullWidth>
                <RadioGroup
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                >
                  <FormControlLabel
                    value="selfManaged"
                    control={
                      <Radio
                        sx={{
                          color: "green",
                          "&.Mui-checked": { color: "green" },
                        }}
                      />
                    }
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium">Self-Managed Delivery</p>
                        <Tooltip
                          title="Coordinate directly with the farmer via phone call or in-person meetup to arrange delivery details"
                          arrow
                        >
                          <HelpOutlineIcon
                            sx={{
                              fontSize: "16px",
                              color: "text.secondary",
                              "&:hover": { color: "text.primary" },
                            }}
                          />
                        </Tooltip>
                        <p className="text-sm text-gray-600 ml-2">₹ 0.00</p>
                      </div>
                    }
                  />

                  <FormControlLabel
                    value="cropChain"
                    control={
                      <Radio
                        sx={{
                          color: "green",
                          "&.Mui-checked": { color: "green" },
                        }}
                      />
                    }
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium">CropChain Delivery</p>
                        <Tooltip
                          title="Professional delivery service handling pickup and drop-off. Flat ₹40 fee for reliable doorstep delivery within 2-3 business days"
                          arrow
                        >
                          <HelpOutlineIcon
                            sx={{
                              fontSize: "16px",
                              color: "text.secondary",
                              "&:hover": { color: "text.primary" },
                            }}
                          />
                        </Tooltip>
                        <p className="text-sm text-gray-600 ml-2">₹ 40.00</p>
                      </div>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-800">Delivery Charges: </p>
              <p className="text-gray-800 font-semibold">
                ₹ {deliveryOption === "cropChain" ? 40 : 0}.00
              </p>
            </div>
            <div className="w-full h-[1px] bg-[#808080] opacity-35" />

            <div className="flex justify-between">
              <p className="text-gray-800">Total: </p>
              <p className="text-gray-800 text-lg font-semibold">
                ₹{" "}
                {getTotalCartAmount() +
                  (deliveryOption === "cropChain" ? 40 : 0)}
                .00
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <h3 className="font-semibold text-lg">Payment Method</h3>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={paymentMode}
                  name="radio-buttons-group"
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <FormControlLabel
                    value="cod"
                    control={
                      <Radio
                        sx={{
                          color: "green",
                          "&.Mui-checked": { color: "green" },
                        }}
                      />
                    }
                    label="Cash on Delivery"
                  />
                  <FormControlLabel
                    value="razorpay"
                    control={
                      <Radio
                        sx={{
                          color: "green",
                          "&.Mui-checked": { color: "green" },
                        }}
                      />
                    }
                    label="UPI/Card (RazorPay)"
                  />
                </RadioGroup>
              </FormControl>
              <label
                htmlFor="place-order"
                className="w-full cursor-pointer py-3 mt-2 bg-[#00B207] text-white rounded-full font-medium hover:bg-[#2C742F] text-center"
              >
                Place Order
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
