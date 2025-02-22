import React, { useState } from 'react';
import { MapPin, Phone, Landmark, Hash, Map, User, Building } from 'lucide-react';

const BoardingPoint = () => {
  const [bpId, setBpId] = useState('');
  const [tripId, setTripId] = useState('');
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseInfo, setResponseInfo] = useState({ status: '', responseCode: '', errorMsg: '' });

  const fetchBoardingPoint = async () => {
    setLoading(true);
    setError(null);
    setBoardingPoint(null);

    try {
      const response = await fetch('/api/bus/boarding-point', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bpId: parseInt(bpId, 10),
          trip_id: parseInt(tripId, 10),
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      setResponseInfo({
        status: data?.status ?? false,
        responseCode: data?.response_code ?? 'No response code',
        errorMsg: typeof data?.data === 'string' ? data.data : 'No specific error',
      });

      if (data.status && data.response_code === 1 && typeof data.data === 'object') {
        setBoardingPoint(data.data);
      } else {
        throw new Error(
          `Error: ${typeof data.data === 'string' ? data.data : 'Unknown error'}`
        );
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch boarding point');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bpId && tripId) {
      fetchBoardingPoint();
    } else {
      setError('Both BP ID and Trip ID are required');
    }
  };

  const renderBoardingPointDetails = () => {
    if (!boardingPoint) return null;

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          {boardingPoint.name}
        </h2>

        {boardingPoint.id && (
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">ID: {boardingPoint.id}</span>
          </div>
        )}

        {boardingPoint.locationName && (
          <div className="flex items-center gap-3">
            <Map className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">Location: {boardingPoint.locationName}</span>
          </div>
        )}

        {boardingPoint.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
            <span className="text-gray-700">Address: {boardingPoint.address}</span>
          </div>
        )}

        {boardingPoint.contactnumber && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">Contact: {boardingPoint.contactnumber}</span>
          </div>
        )}

        {boardingPoint.landmark && (
          <div className="flex items-center gap-3">
            <Landmark className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">Landmark: {boardingPoint.landmark}</span>
          </div>
        )}

        {boardingPoint.name && (
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">Name: {boardingPoint.name}</span>
          </div>
        )}

        {boardingPoint.rbMasterId && (
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">RB Master ID: {boardingPoint.rbMasterId}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Boarding Point Details</h1>

      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">BP ID:</label>
          <input
            type="number"
            value={bpId}
            onChange={(e) => setBpId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Trip ID:</label>
          <input
            type="number"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white rounded transition-colors ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Loading...' : 'Fetch Boarding Point'}
        </button>
      </form>

      {loading && (
        <div className="text-center animate-pulse">
          <div className="text-blue-500">Loading boarding point details...</div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      )}

      {responseInfo.responseCode && !loading && !error && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <strong>Status:</strong> {responseInfo.status ? 'Success' : 'Failure'}
          </div>
          {!responseInfo.status && (
            <div>
              <strong>Error Message:</strong> {responseInfo.errorMsg}
            </div>
          )}
        </div>
      )}

      {renderBoardingPointDetails()}
    </div>
  );
};

export default BoardingPoint;