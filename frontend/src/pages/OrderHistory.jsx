import { useGetUserOrdersQuery } from "../utils/userServices";

const OrderHistory = () => {
  const { data } = useGetUserOrdersQuery();

  console.log(data);
  return (
    <div>
      <div className="h-screen"></div>
    </div>
  );
};

export default OrderHistory;
