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

const ProductView = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id);

  const [product, setProduct] = useState(null);
  const [quantityAvailable, setQuantityAvailable] = useState(null);
  const [retailerCartQuantity, setRetailerCartQuantity] = useState(100);

  const { enqueueSnackbar } = useSnackbar();
  const role = isUserAuthenticated();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleCart = async () => {
    if (!role) {
      enqueueSnackbar("Please Sign In / Sign Up before continuing", {
        variant: "warning",
      });
      return;
    }

    if (!cartItems?.[id]) {
      try {
        if (role === "consumer")
          await dispatch(
            addToCartAsync({
              productId: id,
              cartFarmerId: product?.farmer?._id,
            })
          ).unwrap();

        if (role === "retailer") {
          if (retailerCartQuantity < 100) {
            enqueueSnackbar("Add a minimum of 100kg", { variant: "error" });
            setRetailerCartQuantity(100);
          } else {
            await dispatch(
              updateRetailerCart({
                productId: id,
                cartFarmerId: product?.farmer?._id,
                quantity: retailerCartQuantity,
              })
            ).unwrap();
          }
        }
      } catch (error) {
        enqueueSnackbar(error?.message || "Failed to add item to cart", {
          variant: "error",
        });
        return;
      }
    } else if (role === "retailer") {
      try {
        if (retailerCartQuantity < 100) {
          enqueueSnackbar("Add a minimum of 100KG", { variant: "error" });
          setRetailerCartQuantity(100);
        } else {
          await dispatch(
            updateRetailerCart({
              productId: id,
              cartFarmerId: product?.farmer?._id,
              quantity: retailerCartQuantity,
            })
          ).unwrap();
          enqueueSnackbar("Cart updated!", {
            variant: "success",
          });
        }
      } catch (err) {
        enqueueSnackbar(err?.message || "Failed to add item to cart", {
          variant: "error",
        });
        return;
      }
    } else {
      navigate("/cart");
    }
  };

  useEffect(() => {
    if (data) {
      setProduct(data?.product);
      setQuantityAvailable(data?.product?.quantityAvailableInKg);

      // retailer cart
      if (role === "retailer" && cartItems) {
        setRetailerCartQuantity(cartItems[data?.product._id]);
      }
    }
  }, [data, cartItems, role]);

  const averageRating = product?.ratings?.length
    ? product.ratings.reduce((sum, r) => sum + r.rating, 0) /
      product.ratings.length
    : 0;

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
              ₹{product?.pricePerKg} / kg
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
                <li>Farmer: {product?.farmer?.name}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews
          </h2>
          {product?.ratings?.length > 0 ? (
            <div className="space-y-4">
              {product.ratings.map((rating, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Rating value={rating.rating} readOnly precision={0.5} />
                    <p className="text-sm text-gray-600">
                      by {rating.user?.name || "Anonymous"}
                    </p>
                  </div>
                  <p className="text-gray-700 mt-2">{rating.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;
