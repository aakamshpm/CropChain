import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About | CropChain"; // Set page title
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
          About CropChain
        </h1>
        <p className="text-gray-700 text-lg text-center">
          Empowering Farmers, Connecting Markets. CropChain is a digital
          marketplace that bridges the gap between farmers, consumers, and
          retailers, ensuring fair pricing and direct trade without middlemen.
        </p>

        {/* Features Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Key Features
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              🌱 Direct Market Access – Farmers sell produce without
              intermediaries.
            </li>
            <li>
              📈 Real-Time Price Updates – Stay informed on market trends.
            </li>
            <li>🔒 Buyer Verification – Secure and trusted transactions.</li>
            <li>🚚 Integrated Logistics – Seamless transport and delivery.</li>
          </ul>
        </div>

        {/* Future Enhancements */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Future Enhancements
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              💬 Chat for Price Negotiation – Real-time messaging for buyers and
              sellers.
            </li>
            <li>
              🤖 AI-Powered Price Suggestions – Smart pricing based on market
              trends.
            </li>
            <li>
              🔗 Blockchain Integration – Secure, tamper-proof transactions.
            </li>
            <li>
              📦 Advanced Logistics Tracking – Real-time updates for deliveries.
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Contact Us
          </h2>
          <p className="text-gray-700">📧 Email: support@cropchain.com</p>
          <p className="text-gray-700">📍 Location: India</p>
        </div>
      </div>
    </div>
  );
}
