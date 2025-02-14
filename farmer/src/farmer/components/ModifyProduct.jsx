import { useEffect, useState } from "react";
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
import { addProduct, updateProduct } from "../auth/productActions";
import { resetMessageState } from "../auth/authSlice";

const ModifyProduct = ({
  handleClose,
  open,
  product,
  modify,
  preview,
  setPreview,
  refetch,
}) => {
  const { data: response, error, success } = useSelector((state) => state.auth);

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
    retailerPrice: Yup.number()
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
    if (product && product?.images[0]) {
      setPreview(
        `${import.meta.env.VITE_API_SERVER_URL}/uploads/${product.images[0]}`
      );
    }
  }, [product]);

  useEffect(() => {
    if (success) {
      enqueueSnackbar(response?.message, { variant: "success" });
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
            {modify ? "Update your product" : "Add your product"}
          </Typography>

          <Formik
            initialValues={{
              name: product?.name || "",
              description: product?.description || "",
              harvestDate: product?.harvestDate?.split("T")[0] || "",
              pricePerKg: product?.pricePerKg || "",
              retailerPrice: product?.retailerPrice || "",
              quantityAvailableInKg: product?.quantityAvailableInKg || "",
              category: product?.category || "",
              images: product?.images || [],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              const formData = new FormData();

              // Append product details
              Object.keys(values).forEach((key) => {
                if (key !== "images") formData.append(key, values[key]);
              });

              // Append product id
              formData.append("id", product?._id);

              // Append images
              values.images.forEach((file) => {
                formData.append("images", file);
              });

              {
                !modify
                  ? dispatch(addProduct(formData))
                  : dispatch(updateProduct(formData));
              }

              actions.setSubmitting(false);
              refetch();
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
                    label="Retailer Price Per 100 KG"
                    name="retailerPrice"
                    value={values.retailerPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    error={
                      touched.retailerPrice && Boolean(errors.retailerPrice)
                    }
                    helperText={<ErrorMessage name="retailerPrice" />}
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
                      setPreview(URL.createObjectURL(e.target.files[0]));
                      const files = Array.from(e.target.files);
                      setFieldValue("images", files);
                    }}
                  />

                  {touched.images && errors.images && (
                    <div className="text-red-600">{errors.images}</div>
                  )}
                </Box>
                {preview && (
                  <Box>
                    <img className="w-20" src={preview} alt="" />
                  </Box>
                )}
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  {modify ? "Update" : "Add"}
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

export default ModifyProduct;
