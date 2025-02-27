<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('remitter_aadhar_verifies', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->string('response_code');
            $table->string('message');
            $table->string('mobile');
            $table->string('masked_aadhaar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitter_aadhar_verifies');
    }
};
