<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RechargeController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [AuthenticatedSessionController::class, 'register'])
        ->name('register');
    Route::post('register', [AuthenticatedSessionController::class, 'storeRegister']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
        
    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])
            ->name('dashboard');
            
        // Recharge Routes
        Route::prefix('recharge')->group(function () {
            Route::get('/dorecharge', [RechargeController::class, 'dorecharge']);
            Route::post('/process', [RechargeController::class, 'processRecharge']);
            
            Route::get('/transactions', [RechargeController::class, 'getTransactions']);
            Route::get('/recharge2', [RechargeController::class, 'recharge2']);
            Route::get('/manage-operator', [RechargeController::class, 'manageOperator']);
        });
    });
});

// Recharge Operator Routes
Route::group(['prefix' => 'recharge'], function () {
    Route::get('/operators', [RechargeController::class, 'operators'])
        ->name('recharge.operators');
    Route::get('/operators/list', [RechargeController::class, 'listRechargeOperators']);
    Route::post('/operators', [RechargeController::class, 'storeRechargeOperator']);
    Route::put('/operators/{id}', [RechargeController::class, 'updateRechargeOperator']);
    Route::delete('/operators/{id}', [RechargeController::class, 'deleteRechargeOperator']);
});

// Redirect root to dashboard
Route::redirect('/', '/admin/dashboard');