import { FaClipboardList } from "react-icons/fa";
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
      {orders?.orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[700px] p-6">
          <FaClipboardList className="text-6xl text-gray-500 mb-4" />
          <p className="text-lg text-gray-700">No Orders Found</p>
        </div>
      ) : (
        <OrdersTable orders={orders?.orders} />
      )}
    </div>
  );
};

export default Orders;
