import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center py-10 gap-3">
      <img className="w-80" src="/404.png" alt="404" />
      <h1 className="text-2xl font-semibold">Oops! page not found</h1>
      <p className="text-[#808080] text-sm">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus ea
        sit, animi accusantium corporis natus?
      </p>
      <Link to="/">
        <button className="px-20 py-4 mt-2 bg-[#00B207] text-white rounded-full font-medium">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
