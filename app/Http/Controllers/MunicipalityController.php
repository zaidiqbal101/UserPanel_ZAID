<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\Http;

class MunicipalityController extends Controller
{
    public function MunicipalityOperator()
    {
        return Inertia::render('Admin/Municipality/MunicipalityOperator');
    }
    public function fetchMunicipalityOperator(Request $request)
    {
        $mode = $request->input('mode'); // Get mode from user input

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
            'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I='
        ])->post('https://sit.paysprint.in/service-api/api/v1/service/bill-payment/municipality/getoperator', [
            'mode' => $mode
        ]);

        return response()->json($response->json());
    }



    public function FetchMunicipalityDetails()
    {
        return Inertia::render('Admin/Municipality/FetchMunicipalityDetails');
    }

    public function fetchBillDetails(Request $request)
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
                'accept' => 'application/json'
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/bill-payment/municipality/fetchbill', [
                'canumber' => $request->canumber,
                'operator' => $request->operator
            ]);

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch bill details',
                'message' => $e->getMessage()
            ], 500);
        }
    }



    

    public function PayMunicipalityBill()
    {
        $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3Mzk3OTc1MzUsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5Nzk3NTM1In0.d-5zd_d8YTFYC0pF68wG6qqlyrfNUIBEuvxZ77Rxc0M',
                'accept' => 'application/json',
                'Authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I='
            ])
            ->post('https://sit.paysprint.in/service-api/api/v1/service/bill-payment/municipality/paybill', [
                'canumber' => 921363745,
                'operator' => 36,
                'amount' => 10,
                'ad1' => 22,
                'ad2' => 458,
                'ad3' => 16336200,
                'referenceid' => 20220114,
                'latitude' => 27.2232,
                'longitude' => 78.26535
            ]);
    
        return Inertia::render('Admin/Municipality/MunicipalityBill', [
            'response' => $response->json()
        ]);
    }

    public function MunicipalityStatus()
    {
        return Inertia::render('Admin/Municipality/MunicipalityStatus');
    }
}
