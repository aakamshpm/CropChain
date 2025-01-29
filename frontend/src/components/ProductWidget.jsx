import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

const ProductWidget = ({ product }) => {
  const { _id, name, category, pricePerKg, farmer, images } = product;

  return (
    <>
      <div className="border-2 flex flex-col items-center justify-between gap-1 p-3">
        <Link
          to={`/product/${_id}`}
          className="flex flex-col justify-between h-full"
        >
          <img
            src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${images[0]}`}
            alt="product_image"
          />
          <div>
            <p className="text-xl font-semibold">{name}</p>
            <p className="text-sm">₹ {pricePerKg} /kg</p>
          </div>
        </Link>

        <Link className="flex" to={`/farmer/${farmer._id}`}>
          <PersonIcon />
          <p>{farmer.name}</p>
        </Link>
      </div>
    </>
  );
};

export default ProductWidget;
