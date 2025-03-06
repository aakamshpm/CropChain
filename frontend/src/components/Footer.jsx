import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#1A1A1A] flex flex-col items-center">
      <div className="px-4 sm:px-8 lg:px-28 py-12 w-full">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
          {/* Logo and Description */}
          <div className="w-full lg:w-[30%] flex flex-col items-center lg:items-start gap-2">
            <div className="flex items-center">
              <img src="/plant.png" alt="logo" className="w-10 h-10" />
              <h1 className="text-2xl text-white font-medium ml-1">
                CropChain
              </h1>
            </div>
            <p className="text-sm mt-2 text-[#808080] text-center lg:text-left">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde
              accusamus dignissimos provident iure nihil corporis.
            </p>
          </div>

          {/* Links Section */}
          <div className="w-full lg:w-[65%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* My Account */}
            <div className="flex flex-col items-start">
              <h2 className="text-lg text-white">My Account</h2>
              <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
              <div className="flex flex-col items-start gap-2">
                <Link
                  to="/profile"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  My Account
                </Link>
                <Link
                  to="/my-orders"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Order History
                </Link>
                <Link
                  to="/cart"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Shopping Cart
                </Link>
                <Link
                  to="#"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Wishlist
                </Link>
              </div>
            </div>

            {/* Proxy */}
            <div className="flex flex-col items-start">
              <h2 className="text-lg text-white">Proxy</h2>
              <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
              <div className="flex flex-col items-start gap-2">
                <Link
                  to="/about"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  About
                </Link>
                <Link
                  to="#"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Shop
                </Link>
                <Link
                  to="#"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Product
                </Link>
                <Link
                  to="/my-orders"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Track Order
                </Link>
              </div>
            </div>

            {/* Helps */}
            <div className="flex flex-col items-start">
              <h2 className="text-lg text-white">Helps</h2>
              <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
              <div className="flex flex-col items-start gap-2">
                <Link
                  to="/about"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Contact
                </Link>
                <Link
                  to="#"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  FAQs
                </Link>
                <Link
                  to="#"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="#"
                  className="text-[#808080] text-sm hover:text-white"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Download Mobile App */}
            <div className="flex flex-col items-start">
              <h2 className="text-lg text-white">Download App</h2>
              <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
              <div className="flex gap-3">
                <Link to="#">
                  <img
                    src="/Google_Play.png"
                    alt="playstore"
                    className="w-32 h-auto"
                  />
                </Link>
                <Link to="#">
                  <img
                    src="/App_Store.png"
                    alt="appstore"
                    className="w-32 h-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-[#808080] opacity-40 w-full h-[1px] my-8" />

      {/* Copyright */}
      <div>
        <p className="text-sm text-[#808080] mb-8 text-center">
          CropChain eCommerce © 2025. All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
