import React, { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
const RechargeStatusEnquiry = () => {
  const [referenceId, setReferenceId] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRechargeStatus = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(
        "https://sit.paysprint.in/service-api/api/v1/service/recharge/recharge/status",
        {
          method: "POST",
          headers: {
            "Authorisedkey": "Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=",
            "Token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzg5MjE3NzcsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM4OTIxNzc3In0.6vhPb1SE1p3yvAaK_GAEz-Y0Ai1ibCbN85adKW_1Xzg",
            "accept": "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ referenceid: referenceId }),
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
              <AdminLayout>
    <div className="p-4 max-w-full mx-auto border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">Recharge Status</h2>
      <input
        type="text"
        placeholder="Enter Reference ID"
        value={referenceId}
        onChange={(e) => setReferenceId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={fetchRechargeStatus}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Fetch Status
      </button>

      {loading && <p className="mt-2 text-blue-500">Loading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {response && (
        <div className="mt-4 p-2 border rounded">
          <h3 className="font-semibold">Response Details:</h3>
          <p><strong>Status:</strong> {response.status}</p>
          <p><strong>Message:</strong> {response.message}</p>
          {response.data && (
            <div className="mt-2">
              <p><strong>Txn ID:</strong> {response.data.txnid}</p>
              <p><strong>Operator Name:</strong> {response.data.operatorname}</p>
              <p><strong>Amount:</strong> {response.data.amount}</p>
              <p><strong>Commission:</strong> {response.data.comm}</p>
              <p><strong>Status:</strong> {response.data.status}</p>
              <p><strong>Ref ID:</strong> {response.data.refid}</p>
              <p><strong>Operator ID:</strong> {response.data.operatorid}</p>
              <p><strong>Date Added:</strong> {response.data.dateadded}</p>
            </div>
          )}
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default RechargeStatusEnquiry;
