import {
  LocalOfferOutlined,
  AssignmentTurnedInOutlined,
  MonetizationOnOutlined,
  AddCircleOutlineOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

const Home = () => {
  // Temporary data - replace with real data from API
  const stats = [
    {
      title: "Active Products",
      value: "15",
      icon: <LocalOfferOutlined fontSize="large" />,
      color: "bg-green-600",
    },
    {
      title: "Pending Orders",
      value: "8",
      icon: <AssignmentTurnedInOutlined fontSize="large" />,
      color: "bg-yellow-600",
    },
    {
      title: "Completed Orders",
      value: "32",
      icon: <AssignmentTurnedInOutlined fontSize="large" />,
      color: "bg-blue-600",
    },
    {
      title: "Total Earnings",
      value: "₹52,400",
      icon: <MonetizationOnOutlined fontSize="large" />,
      color: "bg-purple-600",
    },
  ];

  const recentActivities = [
    { time: "Today", action: "New order received for 50kg Wheat" },
    { time: "Yesterday", action: "Order #FC325 marked as shipped" },
    { time: "Apr 18", action: "Added new product - Organic Tomatoes" },
    { time: "Apr 15", action: "Payment received for Order #FC298" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, Farmer Name
        </h1>
        <p className="text-gray-600">Here's your farming dashboard overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <AddCircleOutlineOutlined className="text-green-600 mr-3" />
              Add New Product
            </button>
            <button className="w-full flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <AssignmentTurnedInOutlined className="text-blue-600 mr-3" />
              View Orders
            </button>
            <button className="w-full flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
              <TimelineOutlined className="text-purple-600 mr-3" />
              Sales Report
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales Trend</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <TimelineOutlined className="text-4xl text-gray-300" />
            <span className="text-gray-400 ml-2">
              Sales chart will be displayed here
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 w-24 text-gray-500">
                {activity.time}
              </div>
              <div className="ml-4">{activity.action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
