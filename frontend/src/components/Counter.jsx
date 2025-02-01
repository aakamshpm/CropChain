import { useSnackbar } from "notistack";
import { isUserAuthenticated } from "../utils/userAuth";
import { addToCartAsync, decrementCartItemAsync } from "../utils/cartSlice";
import { useDispatch } from "react-redux";

const Counter = ({
  productId,
  count,
  cartFarmerId,
  quantityAvailable,
  setQuantityAvailable,
}) => {
  const isAuthenticated = isUserAuthenticated();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const removeItem = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Sign In / Sign Up before continuing", {
        variant: "warning",
      });
    } else {
      if (count) {
        dispatch(decrementCartItemAsync(productId));
      }
    }
  };

  const addItem = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Sign In / Sign Up before continuing", {
        variant: "warning",
      });
    } else if (quantityAvailable > 0) {
      try {
        await dispatch(addToCartAsync({ productId, cartFarmerId })).unwrap();
      } catch (err) {
        enqueueSnackbar(err || "Error", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Out of stock!", {
        variant: "warning",
      });
    }
  };

  return (
    <div className="flex justify-center items-center px-2 py-1 border border-gray-300 rounded-full gap-4 shadow-sm">
      {/* Decrement Button */}
      <button
        onClick={removeItem}
        className="px-4 py-2 text-lg bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
      >
        -
      </button>

      {/* Number Display */}
      <p
        className="w-2 text-center text-lg font-medium text-gray-700"
        style={{ minWidth: "1em" }}
      >
        {count ? count : "0"}
      </p>

      {/* Increment Button */}
      <button
        onClick={addItem}
        className="px-4 py-2 text-lg bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default Counter;
