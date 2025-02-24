import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const MunicipalityOperator = () => {
  const [mode, setMode] = useState("online"); // Default mode
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(route("municipality.fetch"), { mode });
      setApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiResponse(null);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Municipality Operators</h1>

      {/* Dropdown for Mode Selection */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Select Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="p-2 w-24 border rounded-md"
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <button
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Fetch Data
        </button>
      </div>

      {/* Show API Response in Table */}
      {loading ? (
        <p className="text-blue-600 font-semibold">Loading...</p>
      ) : apiResponse && apiResponse.data && apiResponse.data.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">View Bill</th>
                <th className="border p-2">Regex</th>
                <th className="border p-2">Display Name</th>
                <th className="border p-2">Ad1 Display Name</th>
                <th className="border p-2">Ad1 Name</th>
                <th className="border p-2">Ad1 Regex</th>
              </tr>
            </thead>
            <tbody>
              {apiResponse.data.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.viewbill}</td>
                  <td className="border p-2">{item.regex || "N/A"}</td>
                  <td className="border p-2">{item.displayname || "N/A"}</td>
                  <td className="border p-2">{item.ad1_d_name || "N/A"}</td>
                  <td className="border p-2">{item.ad1_name || "N/A"}</td>
                  <td className="border p-2">{item.ad1_regex || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-500">No data available</p>
      )}
    </AdminLayout>
  );
};

export default MunicipalityOperator;
