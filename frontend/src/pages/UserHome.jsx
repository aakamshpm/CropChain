import ProductWidget from "../components/ProductWidget";
import { useGetProductsQuery } from "../utils/userServices";

const UserHome = () => {
  const { data: products, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="p-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (products?.data.length === 0) {
    return (
      <div>
        <p>No products</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="grid grid-cols-4">
        {products?.data?.map((product, i) => (
          <ProductWidget product={product} key={i} />
        ))}
      </div>
    </div>
  );
};

export default UserHome;
