import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const RegisterBeneficiary = ({ beneficiaries = [], success = null, response = null, error = null }) => {
  const { data, setData, post, processing, reset } = useForm({
    mobile: '',
    benename: '',
    bankid: '',
    accno: '',
    ifsccode: '',
    verified: '0',
    // Include CSRF token
    _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
  });

  const [localResponse, setLocalResponse] = useState(response);
  const [localError, setLocalError] = useState(error);
  const [activeTab, setActiveTab] = useState('register');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', data);
    
    post('/beneficiary/register', {
      onSuccess: (page) => {
        console.log('Success response:', page.props);
        setLocalResponse(page.props.response);
        setLocalError(null);
        if (page.props.success) {
          reset();
        }
      },
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        setLocalError('Failed to register beneficiary.');
      },
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-4 border-b">
          <button
            className={`p-3 ${activeTab === 'register' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('register')}
          >
            Register Beneficiary
          </button>
          <button
            className={`p-3 ${activeTab === 'list' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('list')}
          >
            Registered Beneficiaries
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'register' && (
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Register Beneficiary</h2>

              {localResponse && (
                <div className={`p-4 mb-4 rounded ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <p>{localResponse.message || 'Operation completed'}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Include hidden CSRF field */}
                <input type="hidden" name="_token" value={data._token} />

                {['mobile', 'benename', 'bankid', 'accno', 'ifsccode'].map((field, index) => (
                  <div key={index}>
                    <label className="block font-semibold capitalize">
                      {field.replace('benename', 'Beneficiary Name')}:
                    </label>
                    <input
                      type="text"
                      value={data[field]}
                      onChange={(e) => setData(field, e.target.value)}
                      className="border rounded-lg p-3 w-full mt-1"
                      required
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
                  disabled={processing}
                >
                  {processing ? 'Submitting...' : 'Submit'}
                </button>

                {localError && <p className="text-red-500 mt-4">{localError}</p>}
              </form>
            </div>
          )}

          {/* Rest of the component remains the same */}
          {activeTab === 'list' && (
            <div className="bg-gray-100 p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Registered Beneficiaries</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="p-3">Beneficiary ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Bank Name</th>
                      <th className="p-3">Account No</th>
                      <th className="p-3">IFSC</th>
                      <th className="p-3">Verified</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Bank Type</th>
                      <th className="p-3">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaries.length > 0 ? (
                      beneficiaries.map((item) => (
                        <tr key={item.id} className="text-center border-t">
                          <td className="p-3">{item.bene_id}</td>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.bankname}</td>
                          <td className="p-3">{item.accno}</td>
                          <td className="p-3">{item.ifsc}</td>
                          <td className="p-3">{item.verified ? 'Yes' : 'No'}</td>
                          <td className="p-3">{item.status === '1' ? 'Active' : 'Inactive'}</td>
                          <td className="p-3">{item.banktype}</td>
                          <td className="p-3">{item.message || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center p-4">No beneficiaries registered yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegisterBeneficiary;