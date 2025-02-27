import { useSnackbar } from "notistack";
import { isUserAuthenticated } from "../utils/userAuth";
import { addToCartAsync, decrementCartItemAsync } from "../utils/cartSlice";
import { useDispatch } from "react-redux";

const Counter = ({ productId, count, cartFarmerId, quantityAvailable }) => {
  const isAuthenticated = isUserAuthenticated();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const removeItem = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Sign In / Sign Up before continuing", {
        variant: "warning",
      });
    } else {
      if (count) {
        try {
          dispatch(decrementCartItemAsync(productId)).unwrap();
        } catch (err) {
          enqueueSnackbar(err, { variant: "error" });
        }
      }
    }
  };

  const addItem = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please Sign In / Sign Up before continuing", {
        variant: "warning",
      });
      return;
    }

    if (quantityAvailable < productId) {
      enqueueSnackbar("Stock exceeded!", { variant: "error" });
    }

    try {
      await dispatch(addToCartAsync({ productId, cartFarmerId })).unwrap();
    } catch (err) {
      enqueueSnackbar(err?.message || "Error", {
        variant: "error",
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
