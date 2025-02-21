import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { isUserAuthenticated } from "../utils/userAuth";
import { useGetProductsQuery } from "../utils/userServices";
import { removeCartItemAsync } from "../utils/cartSlice";
import Counter from "../components/Counter";

const Cart = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const { cartItems } = useSelector((state) => state.cart);

  const role = isUserAuthenticated();

  const dispatch = useDispatch();

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const product in cartItems) {
      const productInfo = products?.data.find((item) => item._id === product);
      if (productInfo) {
        totalAmount += cartItems[product] * productInfo.pricePerKg;
      }
    }
    return totalAmount;
  };

  return (
    <div className="h-screen px-24 py-5">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold">Shopping Cart</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : Object.keys(cartItems).length === 0 ? (
          <div className="mt-2">
            <p>Cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-center gap-4 mt-5">
              <div className="border-[1px] border-[#808080] rounded-md flex flex-col">
                <div className="grid grid-cols-[200px_100px_160px_120px] gap-5 px-4 py-2 items-center">
                  <p className="text-base text-[#808080] font-normal">
                    PRODUCT
                  </p>
                  <p className="text-base text-[#808080] font-normal">PRICE</p>
                  <p className="text-base text-[#808080] font-normal">
                    QUANTITY (KG)
                  </p>
                  <p className="text-base text-[#808080] font-normal">
                    SUBTOTAL
                  </p>
                </div>
                <div className="w-full h-[1px] bg-[#808080]" />
                {products.data.map((product, i) => {
                  if (cartItems[product._id] > 0) {
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="grid grid-cols-[200px_100px_160px_120px_50px] items-center gap-5 px-4 py-2">
                          <div className="flex items-center">
                            <img
                              className="w-14"
                              src={`${
                                import.meta.env.VITE_API_SERVER_URL
                              }/uploads/${product.images[0]}`}
                              alt=""
                            />
                            <p className="text-lg">{product.name}</p>
                          </div>
                          <p className="text-lg">₹ {product.pricePerKg}</p>

                          {/* Cart Counter  */}
                          {role === "retailer" ? (
                            <p className="text-lg">
                              {cartItems[product._id]} KG
                            </p>
                          ) : (
                            <Counter
                              productId={product._id}
                              count={cartItems[product._id]}
                              cartFarmerId={product.farmer._id}
                              quantityAvailable={product.quantityAvailableInKg}
                            />
                          )}

                          <p className="text-lg font-semibold">
                            ₹ {product.pricePerKg * cartItems[product._id]}
                          </p>
                          <button
                            onClick={() =>
                              dispatch(removeCartItemAsync(product._id))
                            }
                            className="outline-none border-none"
                          >
                            <CancelOutlinedIcon
                              sx={{ color: "#808080", cursor: "pointer" }}
                            />
                          </button>
                        </div>
                        <div className="w-[95%] h-[1px] bg-[#808080] opacity-35" />
                      </div>
                    );
                  }
                })}
              </div>

              <div className="border-[1px] border-[#808080] rounded-md p-5 w-[25%]">
                <h2 className="text-xl mb-1 font-medium">Cart Total</h2>

                <div className="flex flex-col items-center">
                  <div className="flex justify-between w-full my-3">
                    <p className="text-gray-800">SubTotal: </p>
                    <p className="text-gray-800">₹ {getTotalCartAmount()}.00</p>
                  </div>
                  <div className="w-full h-[1px] bg-[#808080] opacity-35" />

                  <div className="flex justify-between w-full my-3">
                    <p className="text-gray-800">Shipping: </p>
                    <p className="text-gray-800">₹ 2.00</p>
                  </div>
                  <div className="w-full h-[1px] bg-[#808080] opacity-35" />

                  <div className="flex justify-between w-full my-3">
                    <p className="text-gray-800">Total: </p>
                    <p className="text-lg font-semibold">
                      ₹ {getTotalCartAmount() + 2}.00
                    </p>
                  </div>
                  <Link
                    to="/checkout"
                    className="w-full py-3 bg-[#00B207] text-white rounded-full font-medium hover:bg-[#2C742F] text-center"
                  >
                    Proceed to checkout
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-red-500 mt-2">
              *You can only order from 1 Farmer at time
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
