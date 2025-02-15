import { useState } from 'react';

const OnboardingForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        merchantcode: '',
        mobile: '',
        is_new: '0',
        email: '',
        firm: 'PAYSPRINT',
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [showResponse, setShowResponse] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'is_new' && value !== '0' && value !== '1') {
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://sit.paysprint.in/service-api/api/v1/service/onboard/onboardnew/getonboardurl', {
                method: 'POST',
                headers: {
                    'Authorisedkey': 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                    'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzkyNzI4MjgsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5MjcyODI4In0._dTNvgt_RwE41vqIZ_SiX70dXGh_x4qJP6PTxR677Dw',
                    'accept': 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    callback: 'http://127.0.0.1:8000/members/kyc'
                }),
            });
            const data = await response.json();
            setApiResponse(data);
            setShowResponse(true);
            console.log('Response:', data);
        } catch (error) {
            console.error('Error:', error);
            setApiResponse({
                status: false,
                message: 'An error occurred while processing your request.'
            });
            setShowResponse(true);
        }
    };

    const handleRedirect = () => {
        if (apiResponse?.redirecturl) {
            window.open(apiResponse.redirecturl, '_blank');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
                
                {!showResponse ? (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="merchantcode"
                                    value={formData.merchantcode}
                                    onChange={handleChange}
                                    placeholder="Merchant Code"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="Mobile Number"
                                    pattern="[0-9]{10}"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <select
                                    name="is_new"
                                    value={formData.is_new}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="0">Existing User (0)</option>
                                    <option value="1">New User (1)</option>
                                </select>
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="firm"
                                    value={formData.firm}
                                    onChange={handleChange}
                                    placeholder="Firm Name"
                                    className="w-full p-2 border rounded"
                                    readOnly
                                />
                                <p className="text-sm text-gray-500 mt-1">Default firm name: PAYSPRINT</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className={`p-4 rounded ${apiResponse?.status ? 'bg-green-100' : 'bg-red-100'}`}>
                            <p className="font-medium">
                                Status: {apiResponse?.status ? 'Success' : 'Failed'}
                            </p>
                            <p className="text-gray-700">{apiResponse?.message}</p>
                        </div>
                        
                        {apiResponse?.redirecturl && (
                            <div className="border p-4 rounded">
                                <p className="font-medium mb-2">Redirect URL:</p>
                                <p className="text-sm text-gray-600 break-all mb-2">
                                    {apiResponse.redirecturl}
                                </p>
                                <button
                                    onClick={handleRedirect}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Open Redirect URL
                                </button>
                            </div>
                        )}
                        
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => {
                                    setShowResponse(false);
                                    setApiResponse(null);
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Back to Form
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingForm;