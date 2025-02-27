import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box, Rating, Snackbar, Alert } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CropIcon from "@mui/icons-material/Agriculture";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  fetchFarmerDetails,
  addOrUpdateRating,
  getAverageRating,
} from "../utils/farmerSlice";
import { fetchProductsByFarmer } from "../utils/productSlice";
import ProductWidget from "../components/ProductWidget";

const FarmerDetails = () => {
  const { farmerId } = useParams();
  const dispatch = useDispatch();
  const {
    farmerData: farmer,
    loading,
    error,
    averageRating,
  } = useSelector((state) => state.farmer);

  const { id: userId } = useSelector((state) => state.user.userData);

  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      try {
        await dispatch(fetchFarmerDetails(farmerId)).unwrap();
        dispatch(getAverageRating(farmerId));
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
  }, [dispatch, farmerId]);

  // fetch farmer products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const productsData = await dispatch(
          fetchProductsByFarmer(farmerId)
        ).unwrap();
        setProducts(productsData);
        setProductsError(null);
      } catch (error) {
        setProductsError(error.message);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    if (farmerId) {
      loadProducts();
    }
  }, [dispatch, farmerId]);

  // fetch rating info
  useEffect(() => {
    if (userId && farmer?.ratings) {
      const userRating = farmer.ratings.find((r) => r.userId === userId);
      setRatingValue(userRating?.rating || 0);
    }
  }, [userId, farmer]);

  // Image handler
  const getProductImage = (product) => {
    if (product.images?.length > 0) {
      return `${import.meta.env.VITE_API_IMAGE_URL}/${product.images[0]}`;
    }
    return "https://placehold.co/600x400?text=No+Image+Available";
  };

  const handleRateFarmer = () => {
    dispatch(
      addOrUpdateRating({ farmerId, userId, rating: ratingValue, comment })
    )
      .unwrap()
      .then(() => {
        setSnackbarMessage("Rating submitted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        dispatch(getAverageRating(farmerId)); // Refresh the average rating
      })
      .catch((error) => {
        setSnackbarMessage(`Failed to submit rating: ${error.message}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!farmer) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Farmer not found.</Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Farmer Header */}
          <div className="flex flex-col items-center text-center mb-8">
            {farmer?.profilePicture && (
              <img
                src={
                  `${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                    farmer.profilePicture
                  }` || "/default-avatar.png"
                }
                alt={farmer.name}
                className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-white shadow-lg"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {farmer.firstName + " " + farmer.lastName || "N/A"}
              {farmer.verificationStatus === "approved" && (
                <VerifiedIcon className="text-green-500 ml-2" />
              )}
            </h1>
            <p className="text-lg text-gray-600">{farmer.farmName || "N/A"}</p>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Personal and Farm Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Personal Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <HomeIcon className="mr-2 text-gray-600" />
                Personal Details
              </h3>
              <div className="space-y-2 pl-8">
                <p className="flex items-center text-gray-700">
                  <PhoneIcon className="mr-2 text-gray-500" />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{farmer.phoneNumber || "N/A"}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span>{" "}
                  {farmer?.address
                    ? `${farmer.address.buildingName || ""}, ${
                        farmer.address.street || ""
                      }, ${farmer.address.city || ""}, ${
                        farmer.address.state || ""
                      }, ${farmer.address.postalCode || ""}, ${
                        farmer.address.country || ""
                      }`
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Farm Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CropIcon className="mr-2 text-gray-600" />
                Farm Details
              </h3>
              <div className="space-y-2 pl-8">
                <p className="text-gray-700">
                  <span className="font-medium">Farm Size:</span>{" "}
                  {farmer.farmSizeInAcres
                    ? `${farmer.farmSizeInAcres} acres`
                    : "N/A"}
                </p>
                <p className="flex items-center text-gray-700">
                  <LocationOnIcon className="mr-2 text-red-500" />
                  <span className="font-medium">Location:</span>{" "}
                  {farmer.farmLocation
                    ? `${farmer.farmLocation.latitude}, ${farmer.farmLocation.longitude}`
                    : "N/A"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Crops Grown:</span>{" "}
                  {farmer.cropsGrown?.length > 0
                    ? farmer.cropsGrown.join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Products Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Farm Products</h3>
            {productsLoading ? (
              <p className="text-center text-gray-600">Loading products...</p>
            ) : productsError ? (
              <p className="text-red-500 text-center">{productsError}</p>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product, i) => (
                  <ProductWidget
                    product={product}
                    key={`local-${i}`}
                    imageUrl={getProductImage(product)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No products available</p>
            )}
          </div>

          {/* Rating Section */}
          {userId && (
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-4">Rate This Farmer</h3>
              <Rating
                name="farmer-rating"
                value={ratingValue}
                onChange={(event, newValue) => setRatingValue(newValue)}
                size="large"
                className="mb-4"
              />
              <textarea
                placeholder="Add a comment (optional)"
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleRateFarmer}
                disabled={ratingValue === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Rating
              </button>
            </div>
          )}

          {/* Average Rating */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">Average Rating</h3>
            <Rating
              name="average-rating"
              value={averageRating || 0}
              readOnly
              precision={0.1}
              size="large"
              className="mb-2"
            />
            <p className="text-gray-700">
              {averageRating
                ? `${averageRating.toFixed(1)} out of 5`
                : "No ratings yet"}
            </p>
          </div>

          {/* Verification Status */}
          <div className="text-center">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                farmer.verificationStatus === "approved"
                  ? "bg-green-100 text-green-800"
                  : farmer.verificationStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : farmer.verificationStatus === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {farmer.verificationStatus === "approved" && (
                <VerifiedIcon className="mr-1 h-4 w-4" />
              )}
              {farmer.verificationStatus === "approved"
                ? "Verified Farmer"
                : farmer.verificationStatus === "pending"
                ? "Verification Pending"
                : farmer.verificationStatus === "rejected"
                ? "Verification Rejected"
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FarmerDetails;
