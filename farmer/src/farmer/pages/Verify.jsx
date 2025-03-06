import React, { useState, useEffect } from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";

const Verify = () => {
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [landFile, setLandFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [farmer, setFarmer] = useState(null);

  // Fetch farmer data on component mount
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVER_URL}/api/farmer`,
          { withCredentials: true }
        );
        setFarmer(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch farmer data.");
      }
    };

    fetchFarmerData();
  }, []);

  const handleAadhaarFileChange = (e) => {
    setAadhaarFile(e.target.files[0]);
  };

  const handleLandFileChange = (e) => {
    setLandFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if farmer has already applied for verification
    if (farmer?.appliedForReview) {
      setError("You have already applied for verification.");
      return;
    }

    // Check if both documents are provided
    if (!aadhaarFile || !landFile) {
      setError("Both Aadhaar and Land documents must be provided.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("aadhaar", aadhaarFile);
    formData.append("land", landFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/farmer/upload-docs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during verification."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReApply = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_SERVER_URL}/api/farmer/reapply`,
        {},
        { withCredentials: true }
      );
      console.log(response);
      setFarmer(response.data.farmer);
      setResult(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while reapplying."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!farmer) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <DescriptionIcon className="mr-2 text-blue-500" />
          Document Verification
        </h1>

        {/* Display error if already applied for verification */}
        {farmer?.appliedForReview ? (
          <div className="flex flex-col">
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 flex items-center">
              <ErrorIcon className="mr-2" />
              You have already applied for verification.
            </div>

            <div className="p-1">
              <h3 className="text-lg font-semibold">OCR Results</h3>
              <div className="ml-4 whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded-lg">
                {farmer?.extractedOCR ? (
                  Object.entries(farmer.extractedOCR).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="font-medium capitalize">{key}: </span>
                      <span>{value}</span>
                    </div>
                  ))
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </div>

            <div className="p-1">
              <h3 className="text-lg font-semibold">Verification Status</h3>
              <div className="ml-4 text-sm mt-2 rounded-lg">
                {farmer?.verificationStatus === "approved" ? (
                  <div className="bg-green-100 text-green-800 p-2 rounded-md">
                    <span className="font-medium">Status: </span>Approved
                    {farmer.verifiedAt && (
                      <p className="text-xs text-gray-600">
                        Verified At:{" "}
                        {new Date(farmer.verifiedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : farmer?.verificationStatus === "rejected" ? (
                  <>
                    <div className="bg-red-100 text-red-800 p-2 rounded-md">
                      <span className="font-medium">Status: </span>Rejected
                      {farmer.verifiedAt && (
                        <p className="text-xs text-gray-600">
                          Verified At:{" "}
                          {new Date(farmer.verifiedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleReApply}
                      disabled={loading}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Re-apply"
                      )}
                    </button>
                  </>
                ) : (
                  <div className="bg-gray-100 text-gray-800 p-2 rounded-md">
                    <span className="font-medium">Status: </span>Pending
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="aadhaar"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Aadhaar Document
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <CloudUploadIcon className="text-gray-400 text-4xl" />
                    <p className="mt-2 text-sm text-gray-500">
                      {aadhaarFile
                        ? aadhaarFile.name
                        : "Click to upload Aadhaar"}
                    </p>
                    <input
                      type="file"
                      id="aadhaar"
                      name="aadhaar"
                      onChange={handleAadhaarFileChange}
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="land"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Land Document
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <CloudUploadIcon className="text-gray-400 text-4xl" />
                    <p className="mt-2 text-sm text-gray-500">
                      {landFile ? landFile.name : "Click to upload Land"}
                    </p>
                    <input
                      type="file"
                      id="land"
                      name="land"
                      onChange={handleLandFileChange}
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || farmer?.appliedForReview}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Verify Documents"
              )}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
            <ErrorIcon className="mr-2" />
            {error}
          </div>
        )}
        {result && (
          <div
            className={`mt-6 p-6  border border-green-200 rounded-lg ${
              result.verificationStatus === "rejected"
                ? "bg-red-50"
                : "bg-green-50"
            }  text-green-800`}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {result.verificationStatus !== "rejected" ? (
                <CheckCircleIcon className="mr-2 text-green-500" />
              ) : (
                <CancelIcon className="mr-2 text-red-500" />
              )}
              Verification Result
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Extracted Data</h3>
                <div className="ml-4">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {result.extractedData.name || "Not found"}
                  </p>
                  <p>
                    <span className="font-medium">Aadhaar:</span>{" "}
                    {result.extractedData.aadhaar || "Not found"}
                  </p>
                  <p>
                    <span className="font-medium">Land Record:</span>{" "}
                    {result.extractedData.land || "Not found"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Confidence Score</h3>
                <p className="ml-4">{result.confidenceScore}/3</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Match Status</h3>
                <p className="ml-4">
                  {result?.match.match ? "Matched" : result?.match.message}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Full Text</h3>
                <pre className="ml-4 whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded-lg">
                  {result.fullText}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
