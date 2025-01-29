import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import FarmerDetails from "../components/FarmerDetails";

const ViewFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [open, setOpen] = useState(false);

  const [farmerProducts, setFarmerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVER_URL}/api/farmer/get-all`,
          { withCredentials: true }
        );
        setFarmers(response.data.farmers);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch farmers:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const handleOpen = async (farmer) => {
    setSelectedFarmer(farmer);
    setOpen(true);

    try {
      setProductsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/api/product/farmer/`,
        {
          params: { farmer: farmer._id },
          withCredentials: true,
        }
      );
      setFarmerProducts(response.data.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setFarmerProducts([]); // Clear products on error
    } finally {
      setProductsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFarmer(null);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Failed to load farmers. Please try again later.
      </Typography>
    );
  if (farmers.length === 0)
    return (
      <Typography variant="h6" align="center" mt={4}>
        No farmers available.
      </Typography>
    );

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 }, py: 5 }}>
      <Typography variant="h4" align="center" fontWeight="bold" mb={4}>
        Available Farmers
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {farmers.map((farmer) => (
          <Card
            key={farmer._id}
            sx={{
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 3,
              },
            }}
            onClick={() => handleOpen(farmer)}
          >
            {farmer.profilePicture ? (
              <CardMedia
                component="img"
                height="200"
                image={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                  farmer.profilePicture
                }`}
                alt={`${farmer.name}'s profile`}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
                bgcolor="action.hover"
              >
                <AccountCircleIcon sx={{ fontSize: 100, color: "grey.500" }} />
              </Box>
            )}
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {farmer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Farm Name:</strong> {farmer.farmName || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {farmer.address?.city},{" "}
                {farmer.address?.state}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Crops:</strong> {farmer.cropsGrown?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Farmer Details Modal */}
      <FarmerDetails
        selectedFarmer={selectedFarmer}
        productsLoading={productsLoading}
        handleClose={handleClose}
        open={open}
        farmerProducts={farmerProducts}
      />
    </Box>
  );
};

export default ViewFarmers;
