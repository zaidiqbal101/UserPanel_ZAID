<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RemitterQuery1;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;

class DMTBank1Controller extends Controller
{
    public function QueryRemitter(){
        return Inertia::render('Admin/remitter1/QueryRemitter');
    }
    public function fetchQueryRemitter(Request $request)
    {
        $validated = $request->validate([
            'mobile' => 'required|digits:10'
        ]);
    
        $apiUrl = "https://sit.paysprint.in/service-api/api/v1/service/dmt/kyc/remitter/queryremitter";
    
        $response = Http::withHeaders([
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
            'Content-Type' => 'application/json',
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M'
        ])->post($apiUrl, ['mobile' => $validated['mobile']]);
    
        $responseData = $response->json();
    
        if ($response->successful()) {
            // Store data in the database
            RemitterQuery1::updateOrCreate(
                ['mobile' => $validated['mobile']], // Unique identifier
                [
                    'status' => $responseData['status'] ?? false,
                    'response_code' => $responseData['response_code'] ?? 0,
                    'message' => $responseData['message'] ?? 'No message',
                ]
            );
    
            return response()->json($responseData);
        }
    
        return response()->json(['error' => 'Failed to fetch data'], 500);
    }

    public function RemitterEKYC(){
        return Inertia::render('Admin/remitter1/RemitterE-KYC');
    }
    public function fetchRemitterEKYC(Request $request)
    {
        $response = Http::withHeaders([
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
            'accept' => 'application/json',
            'content-type' => 'application/json',
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/dmt/kyc/remitter/queryremitter/kyc', [
            "mobile" => $request->mobile,
            "lat" => "28.123456",
            "long" => "78.123456",
            "aadhaar_number" => $request->aadhaar_number,
            "data" => "encrypted value of pid data",
            "is_iris" => 2
        ]);
    
        return response()->json($response->json());
    }
    public function RegisterRemitter(){
        return Inertia::render('Admin/remitter1/RegisterRemitter');
    }
    public function processRegisterRemitter(Request $request)
{
    // Validate the input
    $validated = $request->validate([
        'mobile' => 'required',
        'otp' => 'required',
        'stateresp' => 'required',
        'ekyc_id' => 'required',
    ]);
    

    $client = new \GuzzleHttp\Client();
    
    try {
        $response = $client->request('POST', 'https://sit.paysprint.in/service-api/api/v1/service/dmt/kyc/remitter/registerremitter', [
            'headers' => [
                'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'Content-Type' => 'application/json',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
                'accept' => 'application/json',
            ],
            'json' => [
                'mobile' => $validated['mobile'],
                'otp' => $validated['otp'],
                'stateresp' => $validated['stateresp'],
                'ekyc_id' => $validated['ekyc_id'],
            ],
        ]);
        

        $responseBody = json_decode($response->getBody(), true);
        
        // Return the API response back to the frontend
        return response()->json($responseBody);
        
    } catch (\Exception $e) {
        // Handle errors
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
}
//Register Beneficiary
public function RegisterBeneficiary(){
    return Inertia::render('Admin/beneficiary1/RegisterBeneficiary');
}

public function storeBeneficiary(Request $request)
{
    $url = "https://sit.paysprint.in/service-api/api/v1/service/dmt/kyc/beneficiary/registerbeneficiary";

    $headers = [
        'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
        'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
        'Content-Type' => 'application/json',
        'accept' => 'application/json',
    ];

    $data = $request->only([
        'mobile', 'benename', 'bankid', 'accno', 'ifsccode', 'verified', 'gst_state', 'dob', 'address', 'pincode'
    ]);

    $response = Http::withHeaders($headers)->post($url, $data);
    $responseData = $response->json();

    // Extract data fields
    $beneficiaryData = $responseData['data'] ?? [];

    // Return an Inertia response with individual fields
    return Inertia::render('Admin/beneficiary1/RegisterBeneficiary', [
        'responseData' => [
            'status' => $responseData['status'] ?? null,
            'response_code' => $responseData['response_code'] ?? null,
            'message' => $responseData['message'] ?? null,
            'bene_id' => $beneficiaryData['bene_id'] ?? null,
            'bankid' => $beneficiaryData['bankid'] ?? null,
            'bankname' => $beneficiaryData['bankname'] ?? null,
            'name' => $beneficiaryData['name'] ?? null,
            'accno' => $beneficiaryData['accno'] ?? null,
            'ifsc' => $beneficiaryData['ifsc'] ?? null,
            'verified' => $beneficiaryData['verified'] ?? null,
            'banktype' => $beneficiaryData['banktype'] ?? null,
            'status' => $beneficiaryData['status'] ?? null,
        ],
        'flash' => [
            'status' => 'success',
            'message' => 'Beneficiary registered successfully',
        ]
    ]);
}
public function deleteBeneficiary()
{
    return Inertia::render('Admin/beneficiary1/DeleteBeneficiary');
}


public function fetchBeneficiary(Request $request)
{
    // Check if the request contains a mobile number
    if (!$request->has('mobile')) {
        return Inertia::render('Admin/beneficiary1/FetchBeneficiary');
    }

    // Define API URL and headers
    $apiUrl = "https://sit.paysprint.in/service-api/api/v1/service/dmt/kyc/beneficiary/registerbeneficiary/fetchbeneficiary";
    $authorisedKey = "Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=";
    $token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M";

    // Fetch the mobile number from request
    $mobile = $request->input('mobile');

    // Make the API request
    $response = Http::withHeaders([
        'Authorisedkey' => $authorisedKey,
        'Token' => $token,
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ])->post($apiUrl, [
        'mobile' => $mobile,
    ]);

    // Convert response to JSON
    $responseData = $response->json();

    // Pass the response data to the frontend using Inertia
    return Inertia::render('Admin/beneficiary1/FetchBeneficiary', [
        'beneficiaryData' => $responseData,
        'enteredMobile' => $mobile
    ]);
}


public function fetchBeneficiaryByBenied()
{
    return Inertia::render('Admin/beneficiary1/FetchBeneficiaryByBenied');
}
public function pennyDrop()
{
    return Inertia::render('Admin/transaction1/PennyDrop');
}
public function transactionOtp()
{
    return Inertia::render('Admin/transaction1/transactionOtp');
}

}
