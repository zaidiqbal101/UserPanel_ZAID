<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Models\SourceCity;
use App\Models\AvailableTrip;
use App\Models\BusCurrentTrip;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BusTicketController extends Controller
{
    public function getSourceCity()
    {
        return Inertia::render('Admin/busTicket/getSourceCity');
    }

    public function fetchSourceCities()
    {
        try {
            
            $response = Http::withHeaders([
                'accept' => 'application/json',
                'authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'Token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzkxODE3OTQsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5MTgxNzk0In0.xu6dtDjw_kbRZ-WW6SaxbHkedurAhN-IXs8iC-Bsg2s'
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/bus/ticket/source');

            $data = $response->json();

            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . ($data['message'] ?? 'Unknown error'));
            }

            if ($data['status'] && isset($data['data']['cities'])) {
                // 2. Clear existing data
                SourceCity::truncate();

                // 3. Store new data
                foreach ($data['data']['cities'] as $city) {
                    SourceCity::create([
                        'city' => $city['name'],
                        'state' => $city['state'],
                        'location_type' => $city['locationType'],
                        'coordinates' => $city['latitude'] . ',' . $city['longitude']
                    ]);
                }

                // 4. Fetch from database and return
                $cities = SourceCity::all()->map(function ($city) {
                    return [
                        'name' => $city->city,
                        'state' => $city->state,
                        'locationType' => $city->location_type,
                        'latitude' => explode(',', $city->coordinates)[0],
                        'longitude' => explode(',', $city->coordinates)[1]
                    ];
                });

                return response()->json([
                    'status' => true,
                    'data' => [
                        'cities' => $cities
                    ]
                ]);
            }

            throw new \Exception('Invalid data structure received from API');

        } catch (\Exception $e) {
            \Log::error('Failed to fetch cities: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch or store cities',
                'error' => $e->getMessage()
            ], 500);
        }
    }




    public function getAvailableTrip()
    {
        return Inertia::render('Admin/busTicket/getAvailableTrip');
    }
    public function fetchAndStoreAvailableTrips(Request $request)
    {
        try {

            $token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzkxODE3OTQsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5MTgxNzk0In0.xu6dtDjw_kbRZ-WW6SaxbHkedurAhN-IXs8iC-Bsg2s';
            $authKey = 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=';
    
            $response = Http::withHeaders([
                'accept' => 'application/json',
                'content-type' => 'application/json',
                'Token' => $token,
                'authorisedkey' => $authKey
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/bus/ticket/availabletrips', $request->all());
    
            $jsonResponse = $response->json();
            
            // Add additional error checking
            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . ($jsonResponse['message'] ?? 'Unknown error'));
            }
    
            return response()->json($jsonResponse);
    
        } catch (\Exception $e) {
            \Log::error('Bus API Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch trips: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //Current Trip
    
    public function getCurrentTripDetails()
    {
        return Inertia::render('Admin/busTicket/getCurrentTripDetails');
    }

    public function fetchTripDetails(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'trip_id' => 'required|string',
            ]);
    
            // Add logging to track the request
            \Log::info('Fetching trip details for trip_id: ' . $request->trip_id);
    
            // Make the API call
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'authorisedkey' => 'Y2RkZTc2ZmNjODgxODljMjkyN2ViOTlhM2FiZmYyM2I=',
                'token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzkzNDM0NDIsInBhcnRuZXJJZCI6IlBTMDAxNTY4IiwicmVxaWQiOiIxNzM5MzQzNDQyIn0.oenxjDuLp4lPTB_fCDZL98ENr6I-ULmw0u9XkGgWZI4'
            ])->post('https://sit.paysprint.in/service-api/api/v1/service/bus/ticket/tripdetails', [
                'trip_id' => $request->trip_id
            ]);
    
            // Log the API response for debugging
            \Log::info('API Response:', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);
    
            // Check if the request was successful
            if (!$response->successful()) {
                \Log::error('API request failed', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                throw new \Exception('API request failed: ' . $response->status());
            }
    
            $data = $response->json();
    
            // Check if we got valid data
            if (!isset($data['status'])) {
                throw new \Exception('Invalid response format from API');
            }
    
            if (!$data['status']) {
                throw new \Exception($data['message'] ?? 'API returned error status');
            }
    
            return response()->json([
                'status' => true,
                'data' => $data['data'] ?? null,
                'message' => $data['message'] ?? 'Success'
            ]);
    
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Failed to fetch trip details: ' . $e->getMessage());
            
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch trip details: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storeTripDetails(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'trip_id' => 'required',
                'boarding_points' => 'required|array',
                'boarding_points.*.location' => 'required|string',
                'boarding_points.*.address' => 'required|string',
                'boarding_points.*.city' => 'required|string',
                'boarding_points.*.time' => 'required|integer',
                'boarding_points.*.landmark' => 'nullable|string',
                'boarding_points.*.contact' => 'nullable|string',
            ]);

            // Clear existing records for this trip
            BusCurrentTrip::where('trip_id', $request->trip_id)->delete();

            // Store boarding points in the database
            foreach ($request->boarding_points as $point) {
                BusCurrentTrip::create([
                    'trip_id' => $request->trip_id,
                    'location' => $point['location'],
                    'address' => $point['address'],
                    'city' => $point['city'],
                    'time' => $point['time'],
                    'landmark' => $point['landmark'],
                    'contact' => $point['contact']
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Trip details stored successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error storing trip details: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error storing trip details: ' . $e->getMessage()
            ], 500);
        }
    }
   


}