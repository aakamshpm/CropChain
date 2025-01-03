import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";

const AddProduct = ({ handleClose, open }) => {
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

  const [data, setData] = useState({
    name: "",
    description: "",
    pricePerKg: "",
    quantityAvailableInKg: "",
    category: "",
    harvestDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

          <Box display="flex" flexDirection="row" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={data.description}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
          <Box display="flex" flexDirection="row" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Price Per Kg"
              name="pricePerKg"
              type="number"
              value={data.pricePerKg}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Quantity Available"
              name="quantityAvailablePerKg"
              type="number"
              value={data.quantityAvailableInKg}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
          <Box display="flex" flexDirection="row" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={data.category}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Harvest Date"
              name="harvestDate"
              value={data.harvestDate}
              type="date"
              onChange={handleChange}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              margin="normal"
            />
          </Box>
          <Button variant="contained" sx={{ mt: 2 }}>
            Add
          </Button>

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
