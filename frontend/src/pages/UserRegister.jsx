import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";
import { retailerRegister } from "../utils/actions/retailerActions";
import {
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { CITIES_IN_KERALA } from "../utils/constants.js";
import { resetMessageState } from "../utils/userSlice";
import { consumerRegister } from "../utils/actions/consumerActions";

const UserRegister = () => {
  const [selectedValue, setSelectedValue] = useState("Consumer");
  const [currentStep, setCurrentStep] = useState(1);

  const { error, success } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Registration success", { variant: "success" });
      navigate("/");
      dispatch(resetMessageState());
    }

    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(resetMessageState());
    }
  }, [success, error]);

  const validationSchemas = [
    // Step 1: Personal Information
    Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Must be 10 digits")
        .test(
          "is-valid-phone",
          "Invalid phone number",
          (value) => isValidPhoneNumber(`+91${value}`) // Validate with country code
        ),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    // Step 2: Address
    Yup.object({
      address: Yup.object({
        houseName: Yup.string().required("House name is required"),
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        postalCode: Yup.string().required("Postal code is required"),
        country: Yup.string().required("Country is required"),
      }),
    }),
    // Step 3: Shop Details
    Yup.object({
      shopAddress: Yup.object({
        shopName: Yup.string().required("Shop name is required"),
        city: Yup.string().required("Shop city is required"),
        state: Yup.string().required("Shop state is required"),
        postalCode: Yup.string().required("Shop postal code is required"),
      }),
      shopCategory: Yup.string().required("Shop category is required"),
    }),
  ];

  const initialValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    address: {
      houseName: "",
      street: "",
      city: "",
      postalCode: "",
      country: "India",
    },
    shopAddress: {
      shopName: "",
      city: "",
      postalCode: "",
      country: "India",
    },
    shopCategory: "",
  };

  return (
    <div className="flex items-center justify-center h-screen font-['Poppins']">
      <div className="flex flex-col items-center justify-center p-8 border-[1px] w-[40%] border-black rounded-lg">
        <div>
          <RadioGroup
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              setCurrentStep(1); // Reset to Step 1 when user type changes
            }}
            sx={{
              flexDirection: "row",
              ".MuiFormControlLabel-root": {
                position: "relative",
                paddingBottom: "5px",
                margin: "0 10px",
              },
              ".MuiFormControlLabel-root::after": {
                content: '""',
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                height: "2px",
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
              },
              ".MuiFormControlLabel-root[data-selected='true']::after": {
                backgroundColor: "green", // Change the underline color for the selected option
              },
            }}
          >
            {["Consumer", "Retailer"].map((label) => (
              <FormControlLabel
                key={label}
                value={label}
                control={
                  <Radio
                    sx={{
                      display: "none", // Hide the default radio icon
                    }}
                  />
                }
                label={label}
                data-selected={selectedValue === label}
              />
            ))}
          </RadioGroup>
        </div>
        <h1 className="text-2xl mt-4">
          <span className="font-semibold">Register</span> - {selectedValue}
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={
            selectedValue === "Retailer"
              ? validationSchemas[currentStep - 1]
              : validationSchemas[0]
          }
          onSubmit={(values, actions) => {
            if (currentStep < (selectedValue === "Retailer" ? 3 : 2)) {
              setCurrentStep(currentStep + 1);
            } else {
              // Combine country code with phone number before submission
              const payload = {
                ...values,
                phoneNumber: `+91${values.phoneNumber}`,
              };

              selectedValue === "Retailer"
                ? dispatch(retailerRegister(payload))
                : dispatch(consumerRegister(payload));
              actions.resetForm(false);
            }
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="flex flex-col items-center">
              <Box>
                {currentStep === 1 && (
                  <>
                    <TextField
                      fullWidth
                      label="First name"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={<ErrorMessage name="firstName" />}
                    />{" "}
                    <TextField
                      fullWidth
                      label="Last name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={<ErrorMessage name="lastName" />}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={<ErrorMessage name="phoneNumber" />}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              +91
                            </InputAdornment>
                          ),
                        },
                        htmlInput: { maxLength: 10 },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={touched.password && Boolean(errors.password)}
                      helperText={<ErrorMessage name="password" />}
                    />
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={<ErrorMessage name="confirmPassword" />}
                    />
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <TextField
                      fullWidth
                      label="House Name"
                      name="address.houseName"
                      value={values.address.houseName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.address?.houseName &&
                        Boolean(errors.address?.houseName)
                      }
                      helperText={<ErrorMessage name="address.houseName" />}
                    />
                    <TextField
                      fullWidth
                      label="Street"
                      name="address.street"
                      value={values.address.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.address?.street &&
                        Boolean(errors.address?.street)
                      }
                      helperText={<ErrorMessage name="address.street" />}
                    />
                    <TextField
                      fullWidth
                      label="City"
                      name="address.city"
                      value={values.address.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      select
                      error={
                        touched.address?.city && Boolean(errors.address?.city)
                      }
                      helperText={<ErrorMessage name="address.city" />}
                    >
                      {CITIES_IN_KERALA.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      label="Postal Code"
                      name="address.postalCode"
                      value={values.address.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      slotProps={{ htmlInput: { inputMode: "numeric" } }}
                      error={
                        touched.address?.postalCode &&
                        Boolean(errors.address?.postalCode)
                      }
                      helperText={<ErrorMessage name="address.postalCode" />}
                    />
                  </>
                )}
                {currentStep === 3 && selectedValue === "Retailer" && (
                  <>
                    <TextField
                      fullWidth
                      label="Shop Name"
                      name="shopAddress.shopName"
                      value={values.shopAddress.shopName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.shopAddress?.shopName &&
                        Boolean(errors.shopAddress?.shopName)
                      }
                      helperText={<ErrorMessage name="shopAddress.shopName" />}
                    />
                    <TextField
                      fullWidth
                      label="Shop City"
                      name="shopAddress.city"
                      value={values.shopAddress.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.shopAddress?.city &&
                        Boolean(errors.shopAddress?.city)
                      }
                      helperText={<ErrorMessage name="shopAddress.city" />}
                    />
                    <TextField
                      fullWidth
                      label="Shop State"
                      name="shopAddress.state"
                      value={values.shopAddress.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.shopAddress?.state &&
                        Boolean(errors.shopAddress?.state)
                      }
                      helperText={<ErrorMessage name="shopAddress.state" />}
                    />
                    <TextField
                      fullWidth
                      label="Shop Postal Code"
                      name="shopAddress.postalCode"
                      value={values.shopAddress.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.shopAddress?.postalCode &&
                        Boolean(errors.shopAddress?.postalCode)
                      }
                      helperText={
                        <ErrorMessage name="shopAddress.postalCode" />
                      }
                    />
                    <TextField
                      fullWidth
                      label="Shop Country"
                      name="shopAddress.country"
                      value={values.shopAddress.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.shopAddress?.country &&
                        Boolean(errors.shopAddress?.country)
                      }
                      helperText={<ErrorMessage name="shopAddress.country" />}
                    />
                    <TextField
                      fullWidth
                      label="Shop Category"
                      name="shopCategory"
                      value={values.shopCategory}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      error={
                        touched.shopCategory && Boolean(errors.shopCategory)
                      }
                      helperText={<ErrorMessage name="shopCategory" />}
                    />
                  </>
                )}
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#00B207",
                  fontFamily: "Poppins",
                  fontSize: "15px",
                }}
              >
                {selectedValue && currentStep < 2
                  ? "Next"
                  : selectedValue === "Retailer" && currentStep < 3
                  ? "Next"
                  : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="mt-4">
          <p>
            Already Registered?{" "}
            <Link to="/login" className="font-semibold underline">
              Login Now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
