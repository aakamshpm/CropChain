import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../utils/userServices";
import { Rating } from "@mui/material";

const ProductView = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetProductByIdQuery(id);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (data) setProduct(data?.product);
  }, [data]);
  console.log(product);

  const averageRating = product?.ratings?.length
    ? product.ratings.reduce((sum, r) => sum + r.rating, 0) /
      product.rating.length
    : 0;

  if (!product) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-20 py-5">
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

          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductView;
