import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const RemitterEKYC = () => {
  const [mobile, setMobile] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/admin/remitter1/fetchRemitterEKYC", {
        mobile,
        aadhaar_number: aadhaarNumber,
      });

      setResponseData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Remitter E-KYC</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Enter Aadhaar Number"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {responseData && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">API Response:</h3>
            <table className="w-full border-collapse border border-gray-300 bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Field</th>
                  <th className="border border-gray-300 px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Status</td>
                  <td className="border border-gray-300 px-4 py-2">{responseData.status ? "Success" : "Failed"}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Response Code</td>
                  <td className="border border-gray-300 px-4 py-2">{responseData.response_code}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Message</td>
                  <td className="border border-gray-300 px-4 py-2">{responseData.message}</td>
                </tr>
                {responseData.data && (
                  <>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Mobile</td>
                      <td className="border border-gray-300 px-4 py-2">{responseData.data.mobile}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">E-KYC ID</td>
                      <td className="border border-gray-300 px-4 py-2">{responseData.data.ekyc_id}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">State Response</td>
                      <td className="border border-gray-300 px-4 py-2">{responseData.data.stateresp}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RemitterEKYC;
