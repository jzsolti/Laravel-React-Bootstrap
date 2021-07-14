<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


/*
//Auth::routes();
+--------+----------+------------------------+------------------+------------------------------------------------------------------------+------------+
| Domain | Method   | URI                    | Name             | Action                                                                 | Middleware |
+--------+----------+------------------------+------------------+------------------------------------------------------------------------+------------+
|        | GET|HEAD | api/user               |                  | Closure                                                                | api        |
|        |          |                        |                  |                                                                        | auth:api   |
|        | GET|HEAD | login                  | login            | App\Http\Controllers\Auth\LoginController@showLoginForm                | web        |
|        |          |                        |                  |                                                                        | guest      |
|        | POST     | login                  |                  | App\Http\Controllers\Auth\LoginController@login                        | web        |
|        |          |                        |                  |                                                                        | guest      |
|        | POST     | logout                 | logout           | App\Http\Controllers\Auth\LoginController@logout                       | web        |
|        | GET|HEAD | password/confirm       | password.confirm | App\Http\Controllers\Auth\ConfirmPasswordController@showConfirmForm    | web        |
|        |          |                        |                  |                                                                        | auth       |
|        | POST     | password/confirm       |                  | App\Http\Controllers\Auth\ConfirmPasswordController@confirm            | web        |
|        |          |                        |                  |                                                                        | auth       |
|        | POST     | password/email         | password.email   | App\Http\Controllers\Auth\ForgotPasswordController@sendResetLinkEmail  | web        |
|        | GET|HEAD | password/reset         | password.request | App\Http\Controllers\Auth\ForgotPasswordController@showLinkRequestForm | web        |
|        | POST     | password/reset         | password.update  | App\Http\Controllers\Auth\ResetPasswordController@reset                | web        |
|        | GET|HEAD | password/reset/{token} | password.reset   | App\Http\Controllers\Auth\ResetPasswordController@showResetForm        | web        |
|        | GET|HEAD | register               | register         | App\Http\Controllers\Auth\RegisterController@showRegistrationForm      | web        |
|        |          |                        |                  |                                                                        | guest      |
|        | POST     | register               |                  | App\Http\Controllers\Auth\RegisterController@register                  | web        |
|        |          |                        |                  |                                                                        | guest      |
+--------+----------+------------------------+------------------+------------------------------------------------------------------------+------------+
*/

Route::get('password/reset/{token}', '\App\Http\Controllers\HomeController@index')->name('password.reset'); // this route need because of generating laravel password reset email link
Route::view('/{path?}', 'index')->where('path', '.*')->name('react');