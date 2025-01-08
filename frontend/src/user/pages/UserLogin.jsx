import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";
import { retailerLogin } from "../utils/retailer/retailerActions";
import { Box, Button, TextField, Typography } from "@mui/material";
import { resetMessageState } from "../utils/userSlice";

const UserLogin = () => {
  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phoen", "Invalid phone number", (value) =>
        isValidPhoneNumber(value)
      ),
    password: Yup.string().required("Password is required"),
  });

  const { error, success } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Login success", { variant: "success" });
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
      <div className="flex flex-col items-center justify-center p-8 border-[1px] w-[30%] border-black rounded-lg">
        <h1 className="text-2xl">
          <span className="font-semibold">Login</span> - RETAILER
        </h1>
        <Formik
          initialValues={{
            phoneNumber: "+91 ",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            dispatch(retailerLogin(values));

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
                Login
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <p>
            Not registered?{" "}
            <Link to="/register" className="font-semibold underline">
              Register now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
