import { useState } from "react";

export default function FarmerDashboardGuide() {
  const [activeSection, setActiveSection] = useState("overview");
  const [language, setLanguage] = useState("en");

  const sections = [
    { id: "overview", title: { en: "Overview", ml: "അവലോകനം" } },
    {
      id: "profile",
      title: { en: "Managing Profile", ml: "പ്രൊഫൈൽ മാനേജ്മെന്റ്" },
    },
    {
      id: "products",
      title: { en: "Managing Products", ml: "ഉൽപ്പന്നങ്ങൾ മാനേജ്മെന്റ്" },
    },
    {
      id: "orders",
      title: { en: "Managing Orders", ml: "ഓർഡറുകൾ മാനേജ്മെന്റ്" },
    },
    {
      id: "verification",
      title: { en: "Farmer Verification", ml: "കർഷക വിലയിരുത്തൽ" },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          Farmer Guide | കർഷക മാർഗ്ഗദർശി
        </h2>
        <button
          onClick={() => setLanguage(language === "en" ? "ml" : "en")}
          className="mb-4 px-3 py-2 bg-blue-500 text-white rounded-lg"
        >
          {language === "en" ? "Switch to Malayalam" : "English ലേക്ക് മാറ്റുക"}
        </button>
        <ul>
          {sections.map((section) => (
            <li
              key={section.id}
              className={`p-2 cursor-pointer rounded-lg ${
                activeSection === section.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title[language]}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="w-3/4 p-6 bg-white shadow-lg rounded-xl ml-4">
        {activeSection === "overview" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "en" ? "Overview" : "അവലോകനം"}
            </h2>
            <p>
              {language === "en"
                ? "The Farmer Dashboard allows you to manage your profile, add and update products, track orders, and apply for verification. Follow the sections to learn how to use each feature."
                : "കർഷക ഡാഷ്ബോർഡ് പ്രൊഫൈൽ നിയന്ത്രിക്കാൻ, ഉൽപ്പന്നങ്ങൾ ചേർക്കാനും പുതുക്കാനും, ഓർഡറുകൾ ട്രാക്ക് ചെയ്യാനും, വിലയിരുത്തലിന് അപേക്ഷിക്കാനും അനുവദിക്കുന്നു. ഓരോ വിഭാഗവും പഠിക്കാം."}
            </p>
          </div>
        )}

        {activeSection === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "en" ? "Managing Profile" : "പ്രൊഫൈൽ മാനേജ്മെന്റ്"}
            </h2>
            <p>
              {language === "en"
                ? "Farmers can update their profile details such as name, contact information, and farm details from the dashboard. Keeping information up-to-date helps buyers reach out easily."
                : "കർഷകർ ഡാഷ്ബോർഡിൽ നിന്ന് പേര്, ബന്ധപ്പെടുന്നതിനുള്ള വിവരം, ഫാം വിവരങ്ങൾ എന്നിവ പുതുക്കാം. ശരിയായ വിവരങ്ങൾ നല്കുന്നത് വാങ്ങുന്നവരെ എളുപ്പത്തിൽ എത്താൻ സഹായിക്കും."}
            </p>
          </div>
        )}

        {activeSection === "products" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "en"
                ? "Managing Products"
                : "ഉൽപ്പന്നങ്ങൾ മാനേജ്മെന്റ്"}
            </h2>
            <p>
              {language === "en"
                ? "Farmers can add, edit, and delete products. Ensure that product details like name, price, quantity, and images are accurate to attract potential buyers."
                : "കർഷകർ ഉൽപ്പന്നങ്ങൾ ചേർക്കാനും, തിരുത്താനും, ഇല്ലാതാക്കാനും കഴിയും. ഉൽപ്പന്ന വിശദാംശങ്ങൾ (പേര്, വില, അളവ്, ചിത്രം) കൃത്യമായി നൽകുന്നത് കൂടുതൽ ഉപഭോക്താക്കളെ ആകർഷിക്കാൻ സഹായിക്കും."}
            </p>
          </div>
        )}

        {activeSection === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "en" ? "Managing Orders" : "ഓർഡറുകൾ മാനേജ്മെന്റ്"}
            </h2>
            <p>
              {language === "en"
                ? "Farmers can track order status, update delivery details, and communicate with buyers for smooth transactions. Keeping order information updated ensures timely delivery."
                : "കർഷകർ ഓർഡറുകളുടെ നില, ഡെലിവറി വിശദാംശങ്ങൾ പുതുക്കൽ, വാങ്ങുന്നവരുമായി സംവദിക്കൽ എന്നിവ ചെയ്യാം. ഓർഡർ വിവരങ്ങൾ കൃത്യമായി നൽകുന്നത് സമയബന്ധിത ഡെലിവറിയെ ഉറപ്പാക്കുന്നു."}
            </p>
          </div>
        )}

        {activeSection === "verification" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {language === "en" ? "Farmer Verification" : "കർഷക വിലയിരുത്തൽ"}
            </h2>
            <p>
              {language === "en"
                ? "Farmers can upload necessary identity documents for verification. A verified account increases trust and allows access to additional platform features."
                : "കർഷകർ ആവശ്യമായ തിരിച്ചറിയൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്യാം. ഒരു സ്ഥിരീകരിച്ച അക്കൗണ്ട് കൂടുതൽ വിശ്വാസ്യത നൽകുകയും അധിക സവിശേഷതകൾ ഉപയോഗിക്കാൻ അവസരം നൽകുകയും ചെയ്യുന്നു."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
