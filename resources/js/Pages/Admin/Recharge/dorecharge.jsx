import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from '@/Layouts/AdminLayout';

const DoRechargeForm = () => {
  const [formData, setFormData] = useState({
    operator: "",
    canumber: "",
    amount: "",
    referenceid: "",
    status: "",
    response_code: "",
    operatorid: "",
    ackno: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transactions, setTransactions] = useState([]);

  const operators = [
    { id: "11", name: "Airtel" },
    { id: "12", name: "Airtel Digital TV" },
    { id: "13", name: "BSNL" },
    { id: "4", name: " Idea" },
    { id: "14", name: "Dish TV" },
    { id: "18", name: " Jio" },
    { id: "35", name: " MTNL" },
    { id: "34", name: " MTNL Mumbai" },
    { id: "27", name: " Sun Direct" },
    { id: "8", name: " Tata Sky" },
    { id: "10", name: " Videocon D2H" },
    { id: "22", name: " Vodafone" },
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/admin/recharge/transactions');
      const transactionsData = response.data.data || [];
      setTransactions(transactionsData);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to fetch transactions. Please try again later.');
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    console.log('Submitting form data:', formData); // Debugging

    try {
        const response = await axios.post('/admin/recharge/process', formData);
        console.log('Server response:', response.data); // Debugging

        if (response.data.status === true) {
            const updatedTransaction = response.data.data;
            setTransactions(prev => [updatedTransaction, ...prev]);
            setSuccess("Recharge processed successfully!");

            // Reset form
            setFormData({
                operator: "",
                canumber: "",
                amount: "",
                referenceid: "",
                status: "",
                response_code: "",
                operatorid: "",
                ackno: "",
                message: ""
            });

            fetchTransactions();
        } else {
            setError(response.data.message || "Failed to process recharge");
        }
    } catch (err) {
        console.error('Error submitting form:', err); // Debugging
        setError(err.response?.data?.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Do Recharge</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="operator" className="block text-sm font-medium text-gray-700">
                  Operator
                </label>
                <select
                  id="operator"
                  value={formData.operator}
                  onChange={(e) => handleChange("operator", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select operator</option>
                  {operators.map((operator) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="canumber" className="block text-sm font-medium text-gray-700">
                  CA Number
                </label>
                <input
                  id="canumber"
                  type="text"
                  value={formData.canumber}
                  onChange={(e) => handleChange("canumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter CA Number"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                  placeholder="Enter Amount"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="referenceid" className="block text-sm font-medium text-gray-700">
                  Reference ID
                </label>
                <input
                  id="referenceid"
                  type="text"
                  value={formData.referenceid}
                  onChange={(e) => handleChange("referenceid", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter Reference ID"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Process Recharge"}
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Operator</th>
                  <th className="py-2 px-4 border-b text-left">CA Number</th>
                  <th className="py-2 px-4 border-b text-left">Amount</th>
                  <th className="py-2 px-4 border-b text-left">Reference ID</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Response Code</th>
                  <th className="py-2 px-4 border-b text-left">Operator ID</th>
                  <th className="py-2 px-4 border-b text-left">Ack No</th>
                  <th className="py-2 px-4 border-b text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{transaction.operator}</td>
                    <td className="py-2 px-4 border-b">{transaction.canumber}</td>
                    <td className="py-2 px-4 border-b">₹{transaction.amount}</td>
                    <td className="py-2 px-4 border-b">{transaction.referenceid}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        transaction.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">{transaction.response_code}</td>
                    <td className="py-2 px-4 border-b">{transaction.operatorid}</td>
                    <td className="py-2 px-4 border-b">{transaction.ackno}</td>
                    <td className="py-2 px-4 border-b">{transaction.message}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="10" className="py-4 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DoRechargeForm;