import {
  FaUsers,
  FaSeedling,
  FaChartLine,
  FaShoppingCart,
} from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const Home = () => {
  // Temporary data - replace with real data from API
  const stats = [
    {
      title: "Total Farmers",
      value: "2,456",
      icon: <GiFarmer className="text-3xl" />,
      color: "bg-green-100",
    },
    {
      title: "Pending Verifications",
      value: "89",
      icon: <FaSeedling className="text-3xl" />,
      color: "bg-yellow-100",
    },
    {
      title: "Active Consumers",
      value: "5,892",
      icon: <FaUsers className="text-3xl" />,
      color: "bg-blue-100",
    },
    {
      title: "Registered Retailers",
      value: "326",
      icon: <FaShoppingCart className="text-3xl" />,
      color: "bg-purple-100",
    },
  ];

  const recentActivities = [
    { time: "10:30 AM", action: "New farmer registration - John Doe" },
    { time: "9:15 AM", action: "Retailer account approved - GreenMart" },
    { time: "Yesterday", action: "3 new consumer signups" },
    { time: "Apr 15", action: "System maintenance completed" },
  ];

  return (
    <div className="p-6 overflow-y-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back, Admin. Here's your platform summary
        </p>
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
              <div className={`${stat.color} p-4 rounded-lg`}>{stat.icon}</div>
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
              <FaSeedling className="text-green-600 mr-3" />
              Verify New Farmers
            </button>
            <button className="w-full flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <GiFarmer className="text-blue-600 mr-3" />
              View All Farmers
            </button>
            <button className="w-full flex items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
              <FaUsers className="text-purple-600 mr-3" />
              Manage Consumers
            </button>
            <button className="w-full flex items-center p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
              <FaShoppingCart className="text-yellow-600 mr-3" />
              Check Retailers
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Platform Growth</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <FaChartLine className="text-4xl text-gray-300" />
            {/* Replace with actual chart component */}
            <span className="text-gray-400 ml-2">
              Chart will be displayed here
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
              <div className="flex-shrink-0 w-20 text-gray-500">
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
