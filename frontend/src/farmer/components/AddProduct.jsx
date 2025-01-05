import { useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addProduct } from "../auth/productActions";
import { resetMessageState } from "../auth/authSlice";

const AddProduct = ({ handleClose, open }) => {
  const { error, success } = useSelector((state) => state.auth);

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object({
    harvestDate: Yup.string().required("Harvest Date is required"),
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    pricePerKg: Yup.number()
      .typeError("Please enter a valid number")
      .required("Price is required")
      .positive("Enter a positive number")
      .integer("Enter valid number"),
    category: Yup.string().required("Category is required"),
    quantityAvailableInKg: Yup.number()
      .typeError("Please enter a valid number")
      .required("Quantity is required")
      .positive("Enter a positive number")
      .integer("Enter valid number"),
    images: Yup.array()
      .of(Yup.mixed().required("File is required"))
      .min(1, "At least one image is required"),
  });

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  // Styles for background blur
  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px)",
    zIndex: 1,
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Product added", { variant: "success" });
    }
    dispatch(resetMessageState());

    if (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
      dispatch(resetMessageState());
    }
  }, [success, error, dispatch]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="popup-title"
        aria-describedby="popup-description"
        style={backdropStyle}
      >
        <Box sx={modalStyle}>
          <Typography id="popup-title" variant="h6" component="h2">
            Add your product
          </Typography>

          <Formik
            initialValues={{
              name: "",
              description: "",
              harvestDate: "",
              pricePerKg: "",
              quantityAvailableInKg: "",
              category: "",
              images: [],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              console.log(values);
              const formData = new FormData();

              // Append product details
              Object.keys(values).forEach((key) => {
                if (key !== "images") formData.append(key, values[key]);
              });

              // Append images
              values.images.forEach((file) => {
                formData.append("images", file);
              });

              dispatch(addProduct(formData));
              actions.setSubmitting(false);
              handleClose();
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              setFieldValue,
              errors,
              touched,
            }) => (
              <Form>
                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    label="Name"
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
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    error={touched.description && Boolean(errors.description)}
                    helperText={<ErrorMessage name="description" />}
                  />
                </Box>
                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    label="Price per Kg"
                    name="pricePerKg"
                    value={values.pricePerKg}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    error={touched.pricePerKg && Boolean(errors.pricePerKg)}
                    helperText={<ErrorMessage name="pricePerKg" />}
                  />
                  <TextField
                    fullWidth
                    label="Quantity Available"
                    name="quantityAvailableInKg"
                    value={values.quantityAvailableInKg}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    error={
                      touched.quantityAvailableInKg &&
                      Boolean(errors.quantityAvailableInKg)
                    }
                    helperText={
                      touched.quantityAvailableInKg &&
                      errors.quantityAvailableInKg
                    }
                  />
                </Box>
                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    error={touched.category && Boolean(errors.category)}
                    helperText={<ErrorMessage name="category" />}
                  />

                  <TextField
                    fullWidth
                    label="Harvest Date"
                    name="harvestDate"
                    value={values.harvestDate}
                    type="date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    margin="normal"
                    error={touched.harvestDate && Boolean(errors.harvestDate)}
                    helperText={<ErrorMessage name="harvestDate" />}
                  />
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFieldValue("images", files);
                    }}
                  />

                  {touched.images && errors.images && (
                    <div>{errors.images}</div>
                  )}
                </Box>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Add
                </Button>
              </Form>
            )}
          </Formik>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ mt: 2, display: "block", marginLeft: "auto" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AddProduct;
