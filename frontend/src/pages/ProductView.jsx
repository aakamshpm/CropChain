import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../utils/userServices";
import { Rating } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import Counter from "../components/Counter";
import { isUserAuthenticated } from "../utils/userAuth";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../utils/cartSlice";

const ProductView = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id);

  const [product, setProduct] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const isAuthenticated = isUserAuthenticated();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, loading, error } = useSelector((state) => state.cart);

  const handleCart = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Sign In / Sign Up before continuing", {
        variant: "warning",
      });
      return;
    }

    if (!cartItems[id]) {
      dispatch(addToCartAsync(id));
      return;
    }

    navigate("/cart");
  };

  useEffect(() => {
    if (data) setProduct(data?.product);
  }, [data]);

  const averageRating = product?.ratings?.length
    ? product.ratings.reduce((sum, r) => sum + r.rating, 0) /
      product.rating.length
    : 0;

  if (!product) {
    return (
      <div className="h-screen px-24 py-5">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-24 py-5 h-screen">
      <div className="grid grid-cols-2">
        <div className="w-[60%]">
          <img
            src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${
              product?.images[0]
            }`}
            alt=""
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold">{product?.name}</h1>

            <div className="flex items-center mt-2">
              <Rating value={averageRating} readOnly precision={0.5} />
              <p className="ml-1 text-sm">
                {product?.ratings?.length || 0} ratings
              </p>
            </div>

            <p className="mt-4 text-[#2C742F] font-medium text-2xl">
              ₹{product?.pricePerKg}
            </p>
          </div>

          <hr />

          <div className="flex flex-col justify-center">
            <p className="text-[#808080] text-sm">{product?.description}</p>
            <p className="mt-3">
              Quantity Available: {product?.quantityAvailableInKg} kg(s)
            </p>
          </div>

          <hr />

          <div className="flex items-center">
            <Counter productId={id} count={cartItems[id]} />
            <button
              onClick={handleCart}
              className="ml-4 px-28 py-4 bg-[#00B207] text-white rounded-full font-medium"
            >
              {!cartItems[id] ? "Add to cart" : "Go to cart"}
              <LocalMallOutlinedIcon
                className="ml-1"
                sx={{ fontSize: "1.4em" }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
