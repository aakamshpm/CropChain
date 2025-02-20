import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

const ProductWidget = ({ product }) => {
  const {
    _id,
    name,
    category,
    pricePerKg,
    farmer,
    images,
    quantityAvailableInKg,
  } = product;

  return (
    <div className="border-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white flex flex-col">
      {/* Product Image */}
      <Link to={`/product/${_id}`} className="flex-grow">
        <img
          src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${images[0]}`}
          alt="product_image"
          className="w-full h-72 object-cover"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col gap-2">
        <Link to={`/product/${_id}`} className="hover:text-blue-600">
          <h3 className="text-xl font-semibold truncate">{name}</h3>
        </Link>
        <p className="text-lg font-medium text-gray-800">₹ {pricePerKg} /kg</p>

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
        </p>
      </Link>
    </div>
  );
};

export default ProductWidget;
