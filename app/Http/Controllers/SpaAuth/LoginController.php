<?php

namespace App\Http\Controllers\SpaAuth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
       // dd(Auth::check());

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'nullable|boolean'
        ]);

        /*if(Auth::check()){
            Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
        dd(Auth::check());
        }*/

        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']], $request->has('remember'))) {

            $request->session()->regenerate();

            return response()->json(['logged_in' => 1]);

        }else{
            return response()->json(['errors' => ['email' => ['The provided credentials do not match our records.']]], 422);
        }

    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['success' => true]);
    }

    
    public function loggedIn()
    {
        $response = Auth::check()? ['logged_in' => 1]:['not_logged_in' => 1];
        return response()->json($response);
    }
}
