import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import axios from 'axios';

const FetchMunicipalityDetails = () => {
  const [loading, setLoading] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    canumber: '',
    operator: '215'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBillDetails(null);

    try {
      const response = await axios.post('/api/municipality/fetch-bill', formData);
      setBillDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bill details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Fetch Municipality Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="canumber"
                placeholder="Enter CA Number"
                value={formData.canumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="operator"
                value={formData.operator}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching...' : 'Fetch Details'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {billDetails && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Bill Details</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(billDetails, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FetchMunicipalityDetails;