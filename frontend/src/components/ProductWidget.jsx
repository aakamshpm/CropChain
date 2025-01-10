import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

const ProductWidget = ({ product }) => {
  const { _id, name, category, pricePerKg, farmer, images } = product;

  return (
    <div className="px-20 py-5">
      <div className="border-2 flex flex-col items-center justify-center gap-1">
        <Link to={`/product/${_id}`}>
          <img
            src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${images[0]}`}
            alt="product_image"
          />
          <p className="text-xl font-semibold">{name}</p>
          <p className="text-sm">₹ {pricePerKg} /kg</p>
        </Link>

        <Link className="flex" to={`/farmer/${farmer._id}`}>
          <PersonIcon />
          <p>{farmer.name}</p>
        </Link>
      </div>
    </div>
  );
};

export default ProductWidget;
