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
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { resetMessageState } from "../utils/userSlice";
import { consumerRegister } from "../utils/actions/consumerActions";

const UserRegister = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phoen", "Invalid phone number", (value) =>
        isValidPhoneNumber(value)
      ),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const [selectedValue, setSelectedValue] = useState("Consumer");

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

  return (
    <div className="flex items-center justify-center h-screen font-['Poppins']">
      <div className="flex flex-col items-center justify-center p-8 border-[1px] w-[40%] border-black rounded-lg">
        <div>
          <RadioGroup
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
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
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
          initialValues={{
            name: "",
            phoneNumber: "+91 ",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            selectedValue === "Retailer"
              ? dispatch(retailerRegister(values))
              : dispatch(consumerRegister(values));

            actions.resetForm(false);
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="flex flex-col items-center">
              <Box>
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
                />

                <TextField
                  fullWidth
                  label="Full name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  error={touched.name && Boolean(errors.name)}
                  helperText={<ErrorMessage name="name" />}
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
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={<ErrorMessage name="confirmPassword" />}
                />
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
                Register
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <p>
            Already registered?{" "}
            <Link to="/login" className="font-semibold underline">
              Login now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
