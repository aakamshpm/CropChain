import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const CropManage = ({
  isModalOpen,
  setIsModalOpen,
  setFarmerData,
  farmerData,
  cropsGrown,
}) => {
  const [error, setError] = useState(false);

  const handleAddCrop = () => {
    if (!farmerData.newCrop.trim()) {
      setError(true);
      return;
    }

    setFarmerData((prev) => ({
      ...prev,
      cropsGrown: [...prev.cropsGrown, prev.newCrop.trim()],
      newCrop: "",
    }));
    setError(false);
  };

  return (
    <div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            width: "400px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            View/Modify Crops
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {cropsGrown.map((crop, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <Typography>{crop}</Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() =>
                    setFarmerData((prev) => ({
                      ...prev,
                      cropsGrown: prev.cropsGrown.filter(
                        (item) => item !== crop
                      ),
                    }))
                  }
                >
                  Remove
                </Button>
              </Box>
            ))}

            {/* Add New Crop */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <TextField
                label="Add Crop"
                variant="outlined"
                size="small"
                fullWidth
                value={farmerData.newCrop}
                onChange={(e) =>
                  setFarmerData({ ...farmerData, newCrop: e.target.value })
                }
                error={error}
                helperText={error ? "Crop name cannot be empty" : ""}
              />
              <IconButton color="primary" onClick={handleAddCrop}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CropManage;
