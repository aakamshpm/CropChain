import {
  useGetProductsQuery,
  useGetAllFarmersQuery,
} from "../utils/userServices";
import ProductWidget from "../components/ProductWidget";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, CardMedia } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import { useSelector } from "react-redux";

const UserHome = () => {
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
  const allProducts = products?.data || [];
  const navigate = useNavigate();
  const { city } = useSelector((state) => state.user?.address || {});

  useEffect(() => {
    refetch();
  }, [products]);

  // Get location-based data
  const localProducts = city
    ? allProducts.filter((p) => p.farmer?.address?.city === city)
    : [];

  const localFarmers = city
    ? farmers.filter((f) => f.address?.city === city)
    : [];

  // Get first 8 products for featured section
  const featuredProducts = allProducts.slice(0, 8);

  // Group ALL products by category
  const groupedProducts = PRODUCT_CATEGORIES.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {});

  allProducts.forEach((product) => {
    const category = PRODUCT_CATEGORIES.includes(product.category)
      ? product.category
      : "Others";
    groupedProducts[category].push(product);
  });

  // Filter out empty categories
  const nonEmptyCategories = PRODUCT_CATEGORIES.filter(
    (category) => groupedProducts[category]?.length > 0
  );

  // Image handler
  const getProductImage = (product) => {
    if (product.images?.length > 0) {
      return `${import.meta.env.VITE_API_IMAGE_URL}/${product.images[0]}`;
    }
    return "https://placehold.co/600x400?text=No+Image+Available";
  };

  if (loadingProducts || loadingFarmers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="px-24 py-5">
      {/* Local Products Section */}
      {city && localProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Products in {city}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {localProducts.map((product, i) => (
              <ProductWidget
                product={product}
                key={`local-${i}`}
                imageUrl={getProductImage(product)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Local Farmers Section */}
      {city && localFarmers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Farmers in {city}</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {localFarmers.map((farmer) => (
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
                    alt={`${farmer.firstName} ${farmer.lastName}'s profile`}
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
                  {farmer.firstName} {farmer.lastName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {farmer.address?.city}, {farmer.address?.state}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductWidget
                product={product}
                key={`featured-${i}`}
                imageUrl={getProductImage(product)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category-based Products Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">All Products by Category</h2>
        {nonEmptyCategories.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {category} ({groupedProducts[category].length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedProducts[category].map((product, i) => (
                <ProductWidget
                  product={product}
                  key={`category-${i}`}
                  imageUrl={getProductImage(product)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* All Farmers Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Meet Our Farmers</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {farmers.map((farmer) => (
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
                  alt={`${farmer.firstName} ${farmer.lastName}'s profile`}
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
                {farmer.firstName} {farmer.lastName}
              </h3>
              <p className="text-gray-600 text-sm">
                {farmer.address?.city}, {farmer.address?.state}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
