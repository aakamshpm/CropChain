import { useGetAllOrdersQuery } from "../auth/authService";
import OrdersTable from "../components/OrdersTable";

const Orders = () => {
  const { data: orders, isLoading } = useGetAllOrdersQuery();

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <OrdersTable orders={orders?.orders} />
    </div>
  );
};

export default Orders;
