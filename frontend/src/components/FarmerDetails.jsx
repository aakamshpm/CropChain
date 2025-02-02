import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const FarmerDetails = ({
  open,
  handleClose,
  selectedFarmer,
  productsLoading,
  error,
  farmerProducts,
}) => {
  return (
    <>
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
                  image={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                    selectedFarmer.profilePicture
                  }`}
                  alt={`${selectedFarmer.name}'s profile`}
                  sx={{
                    borderRadius: 2,
                    height: "200px",
                    objectFit: "contain",
                  }}
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
              bgcolor: "green",
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default FarmerDetails;
