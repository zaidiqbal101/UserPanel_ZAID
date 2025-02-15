<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RechargeTransaction;
use App\Models\RechargeOperator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;  
class RechargeController extends Controller
{
    
    public function dorecharge()
    {
        return Inertia::render('Admin/Recharge/dorecharge');
    }
    
    public function processRecharge(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'operator' => 'required',
            'canumber' => 'required',
            'amount' => 'required|numeric|min:1',
            'referenceid' => 'required'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
    
        try {
            Log::info('Processing recharge request:', $request->all()); // Log the request data
    
            $transaction = RechargeTransaction::create([
                'operator' => $request->operator,
                'canumber' => $request->canumber,
                'amount' => $request->amount,
                'referenceid' => $request->referenceid,
                'status' => $request->status ?? 'pending',
                'response_code' => $request->response_code,
                'operatorid' => $request->operatorid,
                'ackno' => $request->ackno,
                'message' => $request->message ?? 'Transaction initiated'
            ]);
    
            Log::info('Recharge transaction created:', $transaction->toArray()); // Log the created transaction
    
            return response()->json([
                'status' => true,
                'message' => 'Transaction stored successfully',
                'data' => $transaction
            ]);
    
        } catch (\Exception $e) {
            Log::error('Recharge processing failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString()); // Log the stack trace
    
            return response()->json([
                'status' => false,
                'message' => 'Failed to process recharge',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getTransactions()
    {
        try {
            $transactions = RechargeTransaction::orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'status' => true,
                'data' => $transactions
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch transactions: ' . $e->getMessage());
            
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function recharge2()
    {
        return Inertia::render('Admin/Recharge/Recharge2');
    }
    public function listRechargeOperators()
    {
        try {
            // Fetch operators from database, ordered by most recent first
            $operators = RechargeOperator::orderBy('created_at', 'desc')->get();
            return response()->json([
                'status' => 'success',
                'data' => $operators
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching recharge operators: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch recharge operators'
            ], 500);
    }
}

    public function storeRechargeOperator(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'operator_name' => 'required|string|max:255',
            'service_name' => 'required|string|max:255',
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $operator = RechargeOperator::create([
                'operator_name' => $request->operator_name,
                'service_name' => $request->service_name,
                'date' => $request->date
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Recharge operator created successfully',
                'data' => $operator
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating recharge operator: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create recharge operator',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateRechargeOperator(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'operator_name' => 'required|string|max:255',
            'service_name' => 'required|string|max:255',
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $operator = RechargeOperator::findOrFail($id);
            $operator->update([
                'operator_name' => $request->operator_name,
                'service_name' => $request->service_name,
                'date' => $request->date
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Recharge operator updated successfully',
                'data' => $operator
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating recharge operator: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update recharge operator',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteRechargeOperator($id)
    {
        try {
            $operator = RechargeOperator::findOrFail($id);
            $operator->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Recharge operator deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting recharge operator: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete recharge operator',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function manageOperator()
    {
        return Inertia::render('Admin/Recharge/ManageOperator');
    }
}
