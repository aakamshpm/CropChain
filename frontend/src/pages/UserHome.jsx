import {
  useGetProductsQuery,
  useGetAllFarmersQuery,
} from "../utils/userServices";
import ProductWidget from "../components/ProductWidget";
import FarmerDetails from "../components/FarmerDetails";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, CardMedia, CircularProgress } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const UserHome = () => {
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery();
  const {
    data: farmersData,
    isLoading: loadingFarmers,
    isError: error,
  } = useGetAllFarmersQuery();

  const farmers = farmersData?.farmers || [];

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [open, setOpen] = useState(false);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

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
      setFarmerProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFarmer(null);
  };

  if (loadingProducts || loadingFarmers) {
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
  }

  return (
    <div className="px-24 py-5">
      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Products</h2>
        {products?.data.length === 0 ? (
          <p className="text-gray-600">No products available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.data?.map((product, i) => (
              <ProductWidget product={product} key={i} />
            ))}
          </div>
        )}
      </div>

      {/* Farmers Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Meet Our Farmers</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {farmers.length === 0 ? (
            <p className="text-gray-600">No farmers available</p>
          ) : (
            farmers.map((farmer) => (
              <div
                key={farmer._id}
                className="border rounded-lg shadow-md p-4 min-w-[250px] bg-white cursor-pointer"
                onClick={() => handleOpen(farmer)} // Fixed onClick event
              >
                {farmer.profilePicture ? (
                  <CardMedia
                    component="img"
                    image={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                      farmer.profilePicture
                    }`}
                    alt={`${farmer.name}'s profile`}
                    sx={{ height: "200px", objectFit: "contain" }}
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
                <h3 className="text-lg font-semibold mt-2">{farmer.name}</h3>
                <p className="text-gray-600 text-sm">
                  {farmer.address?.city}, {farmer.address?.state}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Farmer Details Modal */}
      <FarmerDetails
        open={open}
        handleClose={handleClose}
        selectedFarmer={selectedFarmer}
        productsLoading={productsLoading}
        error={error}
        farmerProducts={farmerProducts}
      />
    </div>
  );
};

export default UserHome;
