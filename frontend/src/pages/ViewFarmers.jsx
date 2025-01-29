import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Modal,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

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
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "600px" },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            overflowY: "auto",
            p: 3,
          }}
        >
          {selectedFarmer && (
            <Card sx={{ border: "none", boxShadow: "none" }}>
              {/* Profile Image */}
              {selectedFarmer.profilePicture ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                    selectedFarmer.profilePicture
                  }`}
                  alt={`${selectedFarmer.name}'s profile`}
                  sx={{ borderRadius: 2 }}
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="200px"
                  bgcolor="action.hover"
                >
                  <AccountCircleIcon
                    sx={{ fontSize: 100, color: "grey.500" }}
                  />
                </Box>
              )}

              <CardContent>
                {/* Personal Details Section */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedFarmer.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Contact:</strong> {selectedFarmer.phoneNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedFarmer.address?.street},{" "}
                    {selectedFarmer.address?.city}
                    <br />
                    {selectedFarmer.address?.state},{" "}
                    {selectedFarmer.address?.postalCode}
                  </Typography>
                </Box>

                {/* Farm Details Section */}
                <Box
                  sx={{
                    mb: 2,
                    borderTop: 1,
                    borderBottom: 1,
                    py: 2,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Farm Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Farm Name:</strong>{" "}
                    {selectedFarmer.farmName || "N/A"}
                    <br />
                    <strong>Farm Size:</strong> {selectedFarmer.farmSizeInAcres}{" "}
                    acres
                    <br />
                    <strong>Crops Grown:</strong>{" "}
                    {selectedFarmer.cropsGrown?.join(", ") || "None"}
                  </Typography>
                  {selectedFarmer.farmLocation && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong>{" "}
                      {selectedFarmer.farmLocation.latitude.toFixed(4)},
                      {selectedFarmer.farmLocation.longitude.toFixed(4)}
                    </Typography>
                  )}
                </Box>

                {/* Products Section */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Available Products
                  </Typography>
                  {productsLoading ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  ) : farmerProducts.length === 0 ? (
                    <Typography variant="body2">
                      No products available
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                        },
                        gap: 2,
                      }}
                    >
                      {farmerProducts.map((product) => (
                        <Link
                          to={`/product/${product._id}`}
                          key={product._id}
                          style={{ textDecoration: "none" }}
                        >
                          <Card
                            sx={{
                              borderRadius: 2,
                              boxShadow: 1,
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: 3,
                              },
                            }}
                          >
                            {/* Product Image */}
                            {product.images?.length > 0 && (
                              <CardMedia
                                component="img"
                                image={`${
                                  import.meta.env.VITE_API_SERVER_URL
                                }/uploads/${product.images[0]}`}
                                alt={product.name}
                                sx={{
                                  borderRadius: "8px 8px 0 0",
                                  minHeight: "200px",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ₹{product.pricePerKg}/kg
                                <br />
                                Available: {product.quantityAvailableInKg}kg
                                <br />
                                Category: {product.category}
                              </Typography>
                              {product.harvestDate && (
                                <Typography variant="caption">
                                  Harvested:{" "}
                                  {new Date(
                                    product.harvestDate
                                  ).toLocaleDateString()}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </Box>
                  )}
                  {error && (
                    <Typography variant="body2" color="error">
                      Failed to load products. Please try again later.
                    </Typography>
                  )}
                </Box>

                {/* Bio Section */}
                {selectedFarmer.bio && (
                  <Box
                    sx={{ mt: 2, borderTop: 1, py: 2, borderColor: "divider" }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      About the Farmer
                    </Typography>
                    <Typography variant="body2">
                      {selectedFarmer.bio}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewFarmers;
