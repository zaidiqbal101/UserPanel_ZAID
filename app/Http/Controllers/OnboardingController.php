<?php

namespace App\Http\Controllers;
use App\Models\Onboarding;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function index()
    {
        $onboardings = Onboarding::all();
        return response()->json($onboardings);
    }

    /**
     * Store a newly created onboard record.
     */
    public function store(Request $request)
    {
        $request->validate([
            'merchantcode' => 'required|string|unique:onboardings,merchantcode',
            'mobile' => 'required|digits:10',
            'is_new' => 'required|boolean',
            'email' => 'required|email|unique:onboardings,email',
            'firm' => 'required|string',
            'callback_url' => 'nullable|string',
        ]);

        $onboarding = Onboarding::create([
            'merchantcode' => $request->merchantcode,
            'mobile' => $request->mobile,
            'is_new' => $request->is_new,
            'email' => $request->email,
            'firm' => $request->firm,
            'callback_url' => $request->callback_url,
        ]);

        return response()->json(['message' => 'Onboarding record created successfully', 'data' => $onboarding], 201);
    }

    /**
     * Display the specified onboard record.
     */
    public function show(Onboarding $onboarding)
    {
        return response()->json($onboarding);
    }

    /**
     * Update the specified onboard record.
     */
    public function update(Request $request, Onboarding $onboarding)
    {
        $request->validate([
            'mobile' => 'nullable|digits:10',
            'is_new' => 'nullable|boolean',
            'email' => 'nullable|email|unique:onboardings,email,' . $onboarding->id,
            'firm' => 'nullable|string',
            'callback_url' => 'nullable|string',
        ]);

        $onboarding->update($request->all());

        return response()->json(['message' => 'Onboarding record updated successfully', 'data' => $onboarding]);
    }

    /**
     * Remove the specified onboard record.
     */
    public function destroy(Onboarding $onboarding)
    {
        $onboarding->delete();
        return response()->json(['message' => 'Onboarding record deleted successfully']);
    }
}