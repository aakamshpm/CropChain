import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";
import { retailerLogin } from "../utils/actions/retailerActions";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  InputAdornment,
} from "@mui/material";
import { resetMessageState } from "../utils/userSlice";
import { consumerLogin } from "../utils/actions/consumerActions";

const UserLogin = () => {
  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test(
        "is-valid-phone",
        "Invalid phone number",
        (value) => isValidPhoneNumber(`+91${value}`) // Validate with the prefix
      ),
    password: Yup.string().required("Password is required"),
  });

  const [selectedValue, setSelectedValue] = useState("Consumer");

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
    <div className="flex items-center justify-center h-[30rem] font-['Poppins']">
      <div className="flex flex-col items-center justify-center p-8 border-[1px] w-[30%] border-black rounded-lg">
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
                backgroundColor: "green",
              },
            }}
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {["Consumer", "Retailer"].map((label) => (
              <FormControlLabel
                key={label}
                value={label}
                control={<Radio sx={{ display: "none" }} />}
                label={label}
                data-selected={selectedValue === label}
              />
            ))}
          </RadioGroup>
        </div>
        <h1 className="text-2xl mt-4">
          <span className="font-semibold">Login</span> - {selectedValue}
        </h1>
        <Formik
          initialValues={{
            phoneNumber: "", // Only store the editable part of the phone number
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            const fullPhoneNumber = `+91${values.phoneNumber}`; // Combine prefix with the input
            const payload = {
              phoneNumber: fullPhoneNumber,
              password: values.password,
            };

            selectedValue === "Retailer"
              ? dispatch(retailerLogin(payload))
              : dispatch(consumerLogin(payload));

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
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">+91</InputAdornment>
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
