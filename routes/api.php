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

/* Route::post('login', 'App\Http\Controllers\Auth\LoginController@login');
Route::post('logout', 'App\Http\Controllers\Auth\LoginController@logout');
Route::post('register', 'App\Http\Controllers\Auth\RegisterController@register');
Route::post('password/confirm', ' App\Http\Controllers\Auth\ConfirmPasswordController@confirm');
Route::post('password/email', 'App\Http\Controllers\Auth\ForgotPasswordController@sendResetLinkEmail');
Route::post('password/reset', 'App\Http\Controllers\Auth\ResetPasswordController@reset'); */

Route::post('register', 'App\Http\Controllers\SpaAuth\RegisterController@register');
Route::post('login', 'App\Http\Controllers\SpaAuth\LoginController@login');
Route::post('logout', 'App\Http\Controllers\SpaAuth\LoginController@logout');
Route::post('user/status', 'App\Http\Controllers\SpaAuth\LoginController@loggedIn');
Route::post('verify/email', 'App\Http\Controllers\SpaAuth\LoginController@verifyEmail');
Route::post('password/send-resetlink-email', 'App\Http\Controllers\SpaAuth\ForgotPasswordController@sendResetLinkEmail');
Route::post('password/confirm', ' App\Http\Controllers\SpaAuth\ForgotPasswordController@confirm');
Route::post('password/reset-password', 'App\Http\Controllers\SpaAuth\ForgotPasswordController@resetPassword');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('user-account/get-user', 'App\Http\Controllers\UserController@getUser');
    Route::post('user-account/update', 'App\Http\Controllers\UserController@update');

    Route::prefix('user/articles')->group(function () {
        Route::get('/', 'App\Http\Controllers\UserArticleController@index');
        Route::get('/{article}', 'App\Http\Controllers\UserArticleController@article');
        Route::post('/create', 'App\Http\Controllers\UserArticleController@create');
        Route::put('/{article}', 'App\Http\Controllers\UserArticleController@update');
        Route::delete('/{article}', 'App\Http\Controllers\UserArticleController@delete');
        Route::delete('/{article}/delete-image', 'App\Http\Controllers\UserArticleController@deleteImage');
    });

    Route::prefix('labels')->group(function () {
        Route::get('/', 'App\Http\Controllers\LabelsController@index');
       
    });
});
