import {
  useGetProductsQuery,
  useGetAllFarmersQuery,
} from "../utils/userServices";
import ProductWidget from "../components/ProductWidget";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, CardMedia } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const PRODUCT_CATEGORIES = [
    "Fruits",
    "Vegetables",
    "Grains & Cereals",
    "Dairy Products",
    "Seeds & Nuts",
    "Plant-based Products",
    "Honey & Bee Products",
    "Others",
  ];

  const {
    data: products,
    isLoading: loadingProducts,
    refetch,
  } = useGetProductsQuery();
  const {
    data: farmersData,
    isLoading: loadingFarmers,
    isError: error,
  } = useGetAllFarmersQuery();

  const farmers = farmersData?.farmers || [];

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [products]);

  // Group products with predefined categories
  const groupedProducts = PRODUCT_CATEGORIES.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {});

  // Add products to their categories
  products?.data?.forEach((product) => {
    const category = PRODUCT_CATEGORIES.includes(product.category)
      ? product.category
      : "Others";
    groupedProducts[category].push(product);
  });

  // Filter out empty categories
  const nonEmptyCategories = PRODUCT_CATEGORIES.filter(
    (category) => groupedProducts[category]?.length > 0
  );

  if (loadingProducts || loadingFarmers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="px-24 py-5">
      {/* Products Section organized by categories */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Products</h2>
        {nonEmptyCategories.length === 0 ? (
          <p className="text-gray-600">No products available</p>
        ) : (
          nonEmptyCategories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 capitalize">
                {category} ({groupedProducts[category].length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupedProducts[category].map((product, i) => (
                  <ProductWidget product={product} key={i} />
                ))}
              </div>
            </div>
          ))
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
                onClick={() => navigate(`/farmer/${farmer._id}`)}
              >
                {farmer.profilePicture ? (
                  <CardMedia
                    component="img"
                    image={`${import.meta.env.VITE_API_IMAGE_URL}/${
                      farmer.profilePicture
                    }`}
                    alt={`${
                      farmer.firstName + " " + farmer.lastName
                    }'s profile`}
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
                <h3 className="text-lg font-semibold mt-2">
                  {farmer.firstName + " " + farmer.lastName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {farmer.address?.city}, {farmer.address?.state}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
