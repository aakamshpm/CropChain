import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { searchProductsAsync } from "../utils/productSlice";
import { CircularProgress, Alert } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProductWidget from "../components/ProductWidget";

const SearchProducts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, loading, error } = useSelector((state) => state.product);

  // Extract the search term from the URL query parameter
  const searchTerm = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchProductsAsync(searchTerm));
    }
  }, [searchTerm, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search Results for "{searchTerm}"
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <Grid container spacing={4}>
            {products?.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductWidget product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default SearchProducts;
