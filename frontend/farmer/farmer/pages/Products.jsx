import { useGetProductsByFarmerQuery } from "../auth/authService";

const Products = () => {
  const { data, refetch } = useGetProductsByFarmerQuery();

  if (!data) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Products</h1>
      {data.data.map((product, i) => (
        <div key={i}></div>
      ))}
    </div>
  );
};

export default Products;
