<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RechargeController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\BusTicketController;
use App\Http\Controllers\Remitter2Controller;
use App\Http\Controllers\InsurancePremiumPaymentController;
use App\Http\Controllers\Beneficiary2Controller;
use App\Http\Controllers\Transaction2Controller;
use App\Http\Controllers\Refund2Controller;
use App\Http\Controllers\UtilitybillPaymentController;
use App\Http\Controllers\FastagRechargeController;
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

Route::post('/recharge/update', [RechargeController::class, 'updateTransaction']);

// Recharge Operator Routes
Route::group(['prefix' => 'recharge'], function () {
    Route::get('/operators', [RechargeController::class, 'operators'])->name('recharge.operators');
    Route::get('/operators/list', [RechargeController::class, 'listRechargeOperators']);
    Route::post('/operators', [RechargeController::class, 'storeRechargeOperator']);
    Route::put('/operators/{id}', [RechargeController::class, 'updateRechargeOperator']);
    Route::delete('/operators/{id}', [RechargeController::class, 'deleteRechargeOperator']);
});
Route::get('/admin/recharge/onboarding', [OnboardingController::class, 'index'])->name('admin.onboarding');
Route::post('/admin/recharge/onboarding', [OnboardingController::class, 'store'])->name('admin.onboarding.store');
//Bus Ticket

Route::group(['prefix' => 'admin/busTicket'], function () {
    Route::get('/getSourceCity', [BusTicketController::class, 'getSourceCity'])->name('busTicket.getSourceCity');
    Route::post('/fetchSourceCities', [BusTicketController::class, 'fetchSourceCities'])->name('busTicket.fetchSourceCities');
    //Available Trip
    Route::get('/getAvailableTrip', [BusTicketController::class, 'getAvailableTrip'])->name('busTicket.getAvailableTrip');
    Route::post('/fetchAvailableTrips', [BusTicketController::class, 'fetchAndStoreAvailableTrips'])->name('busTicket.fetchAvailableTrips'); 
    //Current available Trip
    Route::get('/getCurrentTripDetails', [BusTicketController::class, 'getCurrentTripDetails'])->name('busTicket.getCurrentTripDetails');
    Route::post('/fetchTripDetails', [BusTicketController::class, 'fetchTripDetails'])->name('busTicket.fetchTripDetails');
    Route::post('/storeTripDetails', [BusTicketController::class, 'storeTripDetails'])->name('busTicket.storeTripDetails');
});

//DMT Bank 2 Remitter
Route::get('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query');
Route::post('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query.post');
Route::get('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'showQueryForm'])->name('remitter.query');
Route::post('/admin/remitter2/queryRemitter', [Remitter2Controller::class, 'queryRemitter'])->name('remitter.query.post');
Route::post('/admin/remitter2/storeRemitter', [Remitter2Controller::class, 'storeRemitterData'])->name('remitter.store');
//Remitter Adhaar verify 
Route::get('/admin/remitter2/remitterAdhaarVerifyApi', [Remitter2Controller::class, 'showRemitterAdhaarVerifyApi'])->name('remitter.showRemitterAdhaarVerifyApi');
Route::get('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'showRemitterAdhaarVerifyApi']);
Route::post('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'verifyAadhaar']);

Route::get('/admin/remitter2/registerRemitter', [Remitter2Controller::class, 'showVerificationForm'])
    ->name('admin.remitter2.register');
Route::post('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'registerAdhaarRemitter'])
    ->name('admin.remitter2.verify');
    Route::post('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'verifyAadhaar'])->name('remitter.adhaar.verify');
    Route::get('/admin/remitter-adhaar-verify', [Remitter2Controller::class, 'showVerificationForm'])->name('remitter.adhaar.form');
//Register Remitter
Route::get('/admin/remitter2/registerRemitter', [Remitter2Controller::class, 'registerRemitter'])
    ->name('admin.remitter2.register');
    Route::get('/admin/remitter2/registerRemitter', [Remitter2Controller::class, 'registerRemitter'])
    ->name('admin.remitter2.register');
Route::post('/api/admin/remitter2/register-remitter', [Remitter2Controller::class, 'registerRemitter'])
    ->name('api.admin.remitter2.register');
    Route::get('/admin/remitter2/registrations', [Remitter2Controller::class, 'getRegistrations'])
    ->name('admin.remitter2.registrations');
// Redirect root to dashboard

 
//Beneficiary 
Route::get('/admin/beneficiary2/registerBeneficiary', [Beneficiary2Controller::class, 'registerBeneficiary'])->name('beneficiary2.registerBeneficiary');
Route::match(['get', 'post'], '/beneficiary/register', [Beneficiary2Controller::class, 'registerBeneficiary'])->name('beneficiary.register');
Route::post('/beneficiary/register', [Beneficiary2Controller::class, 'registerBeneficiary']);


Route::get('/admin/beneficiary2/deleteBeneficiary', [Beneficiary2Controller::class, 'deleteBeneficiary'])
    ->name('beneficiary2.deleteBeneficiary');
Route::post('/admin/beneficiary2/deleteBeneficiary', [Beneficiary2Controller::class, 'destroyBeneficiary'])
    ->name('beneficiary2.destroyBeneficiary');
    Route::get('/admin/beneficiary2/deletion-history', [Beneficiary2Controller::class, 'getDeletionHistory'])
    ->name('beneficiary2.getDeletionHistory');


Route::get('/admin/beneficiary2/fetchBeneficiary', [Beneficiary2Controller::class, 'fetchBeneficiary'])->name('beneficiary2.fetchBeneficiary');
Route::get('/admin/beneficiary2/fetch', [Beneficiary2Controller::class, 'fetchBeneficiary'])->name('beneficiary2.fetch');


Route::prefix('admin/beneficiary2')->group(function () {
    Route::get('/fetchbyBenied', [Beneficiary2Controller::class, 'fetchbyBenied'])
        ->name('beneficiary2.fetchbyBenied');
    Route::post('/fetch-beneficiary-data', [Beneficiary2Controller::class, 'fetchBeneficiaryData'])
        ->name('beneficiary2.fetchBeneficiaryData');
});

//Transaction 
Route::get('/admin/transaction2/pennyDrop', [Transaction2Controller::class, 'pennyDrop'])->name('transaction2.pennyDrop');
Route::match(['get', 'post'], '/admin/transaction2/pennyDrop', [Transaction2Controller::class, 'pennyDrop'])->name('transaction2.pennyDrop');

Route::get('/admin/transaction2/transactionSentOtp', [Transaction2Controller::class, 'transactionSentOtp'])->name('transaction2.transactionSentOtp');
Route::match(['get', 'post'], '/transaction-sent-otp', [Transaction2Controller::class, 'transactionSentOtp'])->name('transaction.sent.otp');

Route::get('/admin/transaction2/transaction', [Transaction2Controller::class, 'transaction'])->name('transaction2.transaction');
Route::post('/admin/transaction2/transact', [Transaction2Controller::class, 'transact'])->name('transaction2.transact');

Route::get('/admin/transaction2/transactionStatus', [Transaction2Controller::class, 'transactionStatus'])->name('transaction2.transactionStatus');
Route::post('/transaction-status', [Transaction2Controller::class, 'transactionStatus']);



//Refund
Route::get('/admin/refund2/refundOtp', [Refund2Controller::class, 'refundOtp'])->name('transaction2.refundOtp');
Route::match(['get', 'post'], '/admin/refund2/refundOtp', [Refund2Controller::class, 'refundOtp'])->name('refund2.refundOtp');

// Route::match(['get', 'post'], '/admin/refund2/refundOtp', [Refund2Controller::class, 'refundOtp'])
//     ->name('refund2.refundOtp');
Route::get('/admin/refund2/claimRefund', [Refund2Controller::class, 'claimRefund'])->name('transaction2.claimRefund');
Route::post('/admin/refund2/processRefund', [Refund2Controller::class, 'processRefund'])->name('transaction2.processRefund');

//Utility Bill Payment
Route::get('/admin/utility-bill-payment/operator-list', [UtilitybillPaymentController::class, 'operatorList'])
    ->name('utilitybillPayment.operatorList');
    Route::get('/operator-list', [UtilityBillPaymentController::class, 'operatorList'])->name('operator.list');

//Fetch Bill Details
Route::get('/admin/utility-bill-payment/fetch-bill-details', [UtilitybillPaymentController::class, 'fetchBillDetails'])
    ->name('utilitybillPayment.fetchBillDetails');
Route::match(['get', 'post'], '/admin/utility-bill-payment/fetch-bill-details', [UtilitybillPaymentController::class, 'fetchBillDetails'])
    ->name('utilitybillPayment.fetchBillDetails');

//Pay Bill
Route::get('/admin/utility-bill-payment/pay-bill', [UtilitybillPaymentController::class, 'payBill'])
    ->name('UtilityBillPayment.payBill');
Route::post('/admin/utility-bill-payment/process-bill-payment', [UtilitybillPaymentController::class, 'processBillPayment'])
    ->name('UtilityBillPayment.processBillPayment');
   
//Status Enquiry 

Route::get('/admin/utility-bill-payment/utility-status-enquiry', [UtilitybillPaymentController::class, 'utilityStatusEnquiry'])
    ->name('utilityStatusEnquiry');
Route::post('/admin/utility-bill-payment/fetch-utility-status', [UtilitybillPaymentController::class, 'fetchUtilityStatus'])
    ->name('fetchUtilityStatus');

//Insurance Premium Payment
Route::get('/admin/InsurancePremiumPayment/FetchInsuranceBillDetails', [InsurancePremiumPaymentController::class, 'fetchInsuranceBillDetails'])->name('InsurancePremiumPayment.FetchInsuranceBillDetails'); 

Route::get('/admin/InsurancePremiumPayment/PayInsuranceBill', [InsurancePremiumPaymentController::class, 'payInsuranceBill'])->name('InsurancePremiumPayment.PayInsuranceBill'); 
Route::get('/pay-insurance-bill', [InsurancePremiumPaymentController::class, 'payInsuranceBill']);
Route::match(['get', 'post'], '/pay-insurance-bill', [InsurancePremiumPaymentController::class, 'payInsuranceBill']);

Route::get('/admin/InsurancePremiumPayment/FetchInsuranceBillDetails', [InsurancePremiumPaymentController::class, 'fetchInsuranceBillDetails'])->name('InsurancePremiumPayment.FetchInsuranceBillDetails');
Route::post('/admin/InsurancePremiumPayment/fetch-lic-bill', [InsurancePremiumPaymentController::class, 'fetchLICBill'])->name('InsurancePremiumPayment.fetchLICBill');

Route::get('/admin/InsurancePremiumPayment/InsuranceStatusEnquiry',[InsurancePremiumPaymentController::class,'insuranceStatusEnquiry'])->name('InsurancePremiumPayment.InsuranceStatusEnquiry');
Route::post('/admin/InsurancePremiumPayment/fetchInsuranceStatus', [InsurancePremiumPaymentController::class, 'fetchInsuranceStatus'])->name('InsurancePremiumPayment.fetchInsuranceStatus');

//Fastag Recharge
Route::get('/admin/FastagRecharge/FastagOperatorList',[FastagRechargeController::class,'fastagRechargeOperatorList'])->name('FastagRecharge.FastagOperatorList');
Route::get('/admin/fastag-operators', [FastagController::class, 'fastagRechargeOperatorList'])->name('admin.fastag-operators');
Route::redirect('/', '/admin/dashboard');
