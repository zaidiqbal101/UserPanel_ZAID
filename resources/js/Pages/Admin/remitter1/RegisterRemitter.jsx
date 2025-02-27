import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";

const RegisterRemitter = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    stateresp: "",
    ekyc_id: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post("/register-remitter", formData);
      setResponse(res.data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-semibold mb-4">Register Remitter</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="stateresp"
            placeholder="State Response"
            value={formData.stateresp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="ekyc_id"
            placeholder="E-KYC ID"
            value={formData.ekyc_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Remitter"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-200 text-red-800 rounded">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h3 className="font-semibold">API Response:</h3>
            <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RegisterRemitter;
