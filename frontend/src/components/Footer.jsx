import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#1A1A1A] flex flex-col items-center">
      <div className="px-28 py-12 flex items-start justify-between">
        <div className="flex-col items-center w-[30%] gap-2">
          <div className="flex items-center">
            <img src="/plant.png" alt="logo" />
            <h1 className="text-2xl text-white font-medium ml-1">CropChain</h1>
          </div>
          <p className="text-sm mt-2 text-[#808080]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde
            accusamus dignissimos provident iure nihil corporis.
          </p>
        </div>

        <div className="flex justify-between w-[65%]">
          <div className="flex flex-col items-start">
            <h2 className="text-lg text-white">My Account</h2>
            <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
            <div className="flex flex-col items-start gap-2">
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                My Account
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Order History
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Shopping Cart
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Wishlist
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-lg text-white">Proxy</h2>
            <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
            <div className="flex flex-col items-start gap-2">
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                About
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Shop
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Product
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Track Order
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-lg text-white">Helps</h2>
            <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
            <div className="flex flex-col items-start gap-2">
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Contact
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                FAQs
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Terms & Conditions
              </Link>
              <Link to="#" className=" text-[#808080] text-sm hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h2 className="text-lg text-white">Download Mobile App</h2>
            <div className="w-8 my-3 bg-[#00B207] h-[2px]" />
            <div className="flex gap-3">
              <Link to="#">
                <img src="/Google_Play.png" alt="playstore" />
              </Link>
              <Link to="#">
                <img src="/App_Store.png" alt="playstore" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#808080] opacity-40 w-full h-[1px] my-8" />

      <div>
        <p className="text-sm text-[#808080] mb-8">
          CropChain eCommerce © 2025. All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
