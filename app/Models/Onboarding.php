<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Onboarding extends Model
{
    use HasFactory;

    protected $fillable = [
        'merchantcode',
        'mobile',
        'is_new',
        'email',
        'firm',
        'callback_url',
        'api_response',
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'api_response' => 'array',
    ];
}
