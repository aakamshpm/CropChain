import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProductWidget = ({ product, imageUrl }) => {
  const { role } = useSelector((state) => state.user);

  const {
    _id,
    name,
    retailerPrice,
    pricePerKg,
    farmer,
    quantityAvailableInKg,
  } = product;

  return (
    <div className="border-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white flex flex-col">
      {/* Product Image */}
      <Link to={`/product/${_id}`} className="flex-grow">
        <img
          src={imageUrl}
          alt={`${name} product image`}
          className="w-full h-72 object-cover"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x400?text=No+Image+Available";
          }}
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col gap-2">
        <Link to={`/product/${_id}`} className="hover:text-blue-600">
          <h3 className="text-xl font-semibold truncate">{name}</h3>
        </Link>
        <p className="text-lg font-medium text-gray-800">
          ₹{" "}
          {role === "retailer" && retailerPrice
            ? retailerPrice + " /100kg"
            : pricePerKg + " /kg"}
        </p>

        {/* Stock Status */}
        {quantityAvailableInKg < 1 ? (
          <p className="text-sm text-red-500 font-medium">Out of Stock</p>
        ) : (
          <p className="text-sm text-gray-600">
            {quantityAvailableInKg} kgs available
          </p>
        )}
      </div>

      {/* Farmer Details */}
      <Link
        to={`/farmer/${farmer._id}`}
        className="flex items-center gap-2 p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        <PersonIcon className="text-gray-600" />
        <p className="text-sm text-gray-700 truncate">
          {farmer.firstName + " " + farmer.lastName}
          {farmer.verificationStatus === "approved" && (
            <VerifiedIcon className="text-green-500 ml-2" />
          )}
        </p>
      </Link>
    </div>
  );
};

export default ProductWidget;
