import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../utils/userServices";
import { Rating } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Counter from "../components/Counter";
import { isUserAuthenticated } from "../utils/userAuth";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, updateRetailerCart } from "../utils/cartSlice";
import RetailerCounter from "../components/RetailerCounter";
import ProductRatings from "../components/ProductRatings";

const ProductView = () => {
  const { id } = useParams();
  const { data, refetch, isLoading } = useGetProductByIdQuery(id);

  const [product, setProduct] = useState(null);
  const [quantityAvailable, setQuantityAvailable] = useState(null);
  const [retailerCartQuantity, setRetailerCartQuantity] = useState(100);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { role } = useSelector((state) => state.user);

  const handleCart = async () => {
    if (!role) {
      enqueueSnackbar("Please Sign In / Sign Up before continuing", {
        variant: "warning",
      });
      return;
    }

    if (
      role === "retailer" &&
      parseFloat(retailerCartQuantity) > quantityAvailable
    ) {
      enqueueSnackbar("Quantity exceeds stock available", { variant: "error" });
      return;
    }
    const isProductInCart = !!cartItems?.[id];
    const MIN_RETAILER_QUANTITY = 100;

    try {
      if (role === "consumer") {
        if (isProductInCart) {
          navigate("/cart");
          return;
        }
        await dispatch(
          addToCartAsync({
            productId: id,
            cartFarmerId: product?.farmer?._id,
          })
        ).unwrap();
        enqueueSnackbar("Item added to cart!", { variant: "success" });
      } else if (role === "retailer") {
        if (retailerCartQuantity < MIN_RETAILER_QUANTITY) {
          enqueueSnackbar("Add a minimum of 100kg", { variant: "error" });
          setRetailerCartQuantity(MIN_RETAILER_QUANTITY);
          return;
        }

        await dispatch(
          updateRetailerCart({
            productId: id,
            cartFarmerId: product?.farmer?._id,
            quantity: retailerCartQuantity,
          })
        ).unwrap();

        enqueueSnackbar(
          isProductInCart ? "Cart updated!" : "Item added to cart!",
          { variant: "success" }
        );
      }
    } catch (error) {
      const errorMessage =
        error.error || error.message || "Failed to update cart";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  useEffect(() => {
    if (data) {
      setProduct(data?.product);
      setQuantityAvailable(data?.product?.quantityAvailableInKg);

      // retailer cart
      if (role === "retailer" && cartItems) {
        setRetailerCartQuantity(cartItems[data?.product._id] || 100);
      }
    }
    refetch();
  }, [data, cartItems, role]);

  const averageRating = product?.averageRating || 0;

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="w-full lg:w-[80%]">
            <img
              src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
                product?.images[0]
              }`}
              alt={product?.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              {product?.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <Rating value={averageRating} readOnly precision={0.5} />
              <p className="text-sm text-gray-600">
                ({product?.ratings?.length || 0} ratings)
              </p>
            </div>

            {/* Price */}
            <p className="text-3xl font-semibold text-green-600">
              ₹{" "}
              {role === "retailer" && product.retailerPrice
                ? product.retailerPrice + " /100kg"
                : product.pricePerKg + " /kg"}
            </p>

            {/* Description */}
            <div className="text-gray-700">
              <p className="text-lg font-medium">Description</p>
              <p className="text-sm">{product?.description}</p>
            </div>

            {/* Stock Status */}
            <div className="text-gray-700">
              <p className="text-lg font-medium">Availability</p>
              {!quantityAvailable || quantityAvailable < 1 ? (
                <p className="text-red-600">Out of Stock</p>
              ) : (
                <p className="text-green-600">
                  {quantityAvailable} kg(s) available
                </p>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="flex items-start space-x-2">
              {role === "retailer" ? (
                <div className="flex flex-col">
                  <RetailerCounter
                    cartQuantity={retailerCartQuantity}
                    setCartQuantity={setRetailerCartQuantity}
                    quantityAvailable={quantityAvailable}
                  />
                  <p className="text-sm mt-2 text-gray-500">
                    Minimum order quantity:{" "}
                    <span className="font-medium text-black">100 KG</span>
                  </p>
                </div>
              ) : (
                <Counter
                  productId={id}
                  count={cartItems[id]}
                  cartFarmerId={product.farmer._id}
                  quantityAvailable={quantityAvailable}
                  setQuantityAvailable={setQuantityAvailable}
                />
              )}

              {/* Add to cart button  */}
              <button
                onClick={handleCart}
                className="flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                {!cartItems[id]
                  ? "Add to Cart"
                  : role === "retailer"
                  ? "Update Cart"
                  : "Go to Cart"}
                <LocalMallOutlinedIcon className="ml-2" />
              </button>
            </div>

            {/* Additional Details */}
            <div className="text-gray-700">
              <p className="text-lg font-medium">Product Details</p>
              <ul className="list-disc list-inside text-sm">
                <li>Category: {product?.category}</li>
                <li>
                  Harvest Date:{" "}
                  {new Date(product?.harvestDate).toLocaleDateString()}
                </li>
                <li>Farm: {product?.farmer?.farmName}</li>
                <li>
                  Farmer:{" "}
                  {product?.farmer?.firstName + " " + product?.farmer?.lastName}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ProductRatings
          productId={id}
          ratings={product?.ratings}
          averageRating={averageRating}
          refetchProduct={refetch}
        />
      </div>
    </div>
  );
};

export default ProductView;
