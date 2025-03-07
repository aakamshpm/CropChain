import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  FormControl,
  FormHelperText,
  Stack,
  Avatar,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  addProduct,
  fetchAllProducts,
  updateProduct,
} from "../auth/productActions";
import { AttachFile, Close } from "@mui/icons-material";

const ModifyProduct = ({
  handleClose,
  open,
  product,
  modify,
  preview,
  setPreview,
  farmerId,
}) => {
  const CATEGORIES = [
    "Fruits",
    "Vegetables",
    "Grains & Cereals",
    "Dairy Products",
    "Seeds & Nuts",
    "Plant-based Products",
    "Honey & Bee Products",
    "Others",
  ];

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // Validation schema for form fields
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    pricePerKg: Yup.number()
      .typeError("Please enter a valid number")
      .required("Price is required")
      .positive("Enter a positive number"),

    quantityAvailableInKg: Yup.number()
      .typeError("Please enter a valid number")
      .required("Quantity is required")
      .positive("Enter a positive number"),
    category: Yup.string().required("Category is required"),
    harvestDate: Yup.date().required("Harvest date is required"),
    images: Yup.array()
      .of(Yup.mixed().required("File is required"))
      .min(1, "At least one image is required"),
  });

  // Modal styles
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
    maxHeight: "90vh",
    overflowY: "auto",
    zIndex: 1300, // Ensure modal is on top
  };

  // Set preview image if product exists
  useEffect(() => {
    if (product && product?.images[0]) {
      setPreview(
        `${import.meta.env.VITE_API_SERVER_URL}/uploads/${product.images[0]}`
      );
    }
  }, [product]);

  const onSubmitAction = async (formData, actions) => {
    let response;
    try {
      modify
        ? (response = await dispatch(updateProduct(formData)).unwrap())
        : (response = await dispatch(addProduct(formData)).unwrap());

      dispatch(fetchAllProducts({ farmerId }));

      enqueueSnackbar(response?.message, { variant: "success" });
      actions.setSubmitting(false);
      handleClose();
    } catch (err) {
      dispatch(fetchAllProducts({ farmerId }));
      enqueueSnackbar(err?.message, { variant: "error" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      <Box sx={modalStyle}>
        <Typography id="popup-title" variant="h6" component="h2" mb={3}>
          {modify ? "Update Product" : "Add Product"}
        </Typography>

        <Formik
          initialValues={{
            name: product?.name || "",
            description: product?.description || "",
            pricePerKg: product?.pricePerKg || "",
            retailerPrice: product?.retailerPrice || "",
            quantityAvailableInKg: product?.quantityAvailableInKg || "",
            category: product?.category || "",
            harvestDate: product?.harvestDate?.split("T")[0] || "", // Format date for input
            images: product?.images || [],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              if (key !== "images") formData.append(key, values[key]);
            });
            if (modify) formData.append("id", product?._id); // Add product ID for updates
            values.images.forEach((file) => {
              formData.append("images", file);
            });
            // Dispatch add or update action
            onSubmitAction(formData, actions);
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
              <Stack spacing={3}>
                {/* Name and Description */}
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    error={touched.description && Boolean(errors.description)}
                    helperText={<ErrorMessage name="description" />}
                  />
                </Box>

                {/* Price, Retailer Price, and Quantity */}
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Price per Kg"
                    name="pricePerKg"
                    value={values.pricePerKg}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.pricePerKg && Boolean(errors.pricePerKg)}
                    helperText={<ErrorMessage name="pricePerKg" />}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Retailer Price (per 100 kg)"
                    name="retailerPrice"
                    value={values.retailerPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.retailerPrice && Boolean(errors.retailerPrice)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Quantity Available (kg)"
                    name="quantityAvailableInKg"
                    value={values.quantityAvailableInKg}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.quantityAvailableInKg &&
                      Boolean(errors.quantityAvailableInKg)
                    }
                    helperText={<ErrorMessage name="quantityAvailableInKg" />}
                  />
                </Box>

                {/* Category and Harvest Date */}
                <Box display="flex" gap={2}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category && Boolean(errors.category)}
                    helperText={<ErrorMessage name="category" />}
                  >
                    {CATEGORIES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Harvest Date"
                    name="harvestDate"
                    value={values.harvestDate}
                    type="date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: true }}
                    error={touched.harvestDate && Boolean(errors.harvestDate)}
                    helperText={<ErrorMessage name="harvestDate" />}
                  />
                </Box>

                {/* Image Upload */}
                <FormControl
                  fullWidth
                  error={touched.images && !!errors.images}
                >
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AttachFile />}
                    sx={{ width: "100%" }}
                  >
                    Upload Images
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        setPreview(URL.createObjectURL(e.target.files[0]));
                        setFieldValue("images", Array.from(e.target.files));
                      }}
                      sx={{ display: "none" }}
                    />
                  </Button>
                  {touched.images && errors.images && (
                    <FormHelperText>{errors.images}</FormHelperText>
                  )}
                </FormControl>

                {/* Image Preview */}
                {preview && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={preview}
                      alt="Product Preview"
                      variant="rounded"
                      sx={{ width: 100, height: 100 }}
                    />
                    <Button
                      onClick={() => {
                        setPreview(null);
                        setFieldValue("images", []);
                      }}
                      startIcon={<Close />}
                      color="error"
                    >
                      Remove
                    </Button>
                  </Box>
                )}

                {/* Submit and Close Buttons */}
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    color="secondary"
                  >
                    Close
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    {modify ? "Update" : "Add"}
                  </Button>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ModifyProduct;
