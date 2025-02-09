import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="flex flex-col bg-green-800 text-white w-64 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-6 border-b border-green-700">
        <img
          src="/plant.png" // Logo from the public folder
          alt="CropChain Logo"
          className="h-12 w-12 mr-2"
        />
        <h1 className="text-2xl font-bold">CropChain</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              <span className="ml-2">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/verify-farmers"
              className="flex items-center p-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              <span className="ml-2">Verify Farmers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/view-farmers"
              className="flex items-center p-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              <span className="ml-2">View Farmers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/consumers"
              className="flex items-center p-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              <span className="ml-2">Consumers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/retailers"
              className="flex items-center p-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              <span className="ml-2">Retailers</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={() => {
            // Add logout logic here
            console.log("Logged out");
          }}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-red-600 hover:bg-red-700 transition duration-300"
        >
          <span className="ml-2">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
