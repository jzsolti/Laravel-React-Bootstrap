<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::post('login', 'App\Http\Controllers\Auth\LoginController@login');
Route::post('logout', 'App\Http\Controllers\Auth\LoginController@logout');
Route::post('register', 'App\Http\Controllers\Auth\RegisterController@register');
Route::post('password/confirm', ' App\Http\Controllers\Auth\ConfirmPasswordController@confirm');
Route::post('password/email', 'App\Http\Controllers\Auth\ForgotPasswordController@sendResetLinkEmail');
Route::post('password/reset', 'App\Http\Controllers\Auth\ResetPasswordController@reset');*/

Route::post('register', 'App\Http\Controllers\SpaAuth\RegisterController@register');
Route::post('login', 'App\Http\Controllers\SpaAuth\LoginController@login');
Route::post('logout', 'App\Http\Controllers\SpaAuth\LoginController@logout');
Route::post('user/status', 'App\Http\Controllers\SpaAuth\LoginController@loggedIn');
Route::post('verify/email', 'App\Http\Controllers\SpaAuth\LoginController@verifyEmail');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
