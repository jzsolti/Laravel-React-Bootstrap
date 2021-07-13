<?php

namespace App\Http\Controllers\SpaAuth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Notifications\EmailVerification;
use App\Models\UserVerification;
use Carbon\Carbon;
use App\Services\UserService;

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
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'nullable|boolean'
        ]);

        if (Auth::guard()->attempt(['email' => $credentials['email'], 'password' => $credentials['password']], $credentials['remember'])) {
           
           $response = ['logged_in' => 1];
            $user = Auth::user();
            if ($request->session()->exists('email_verification_token') && is_null($user->email_verified_at)) {
                $this->userEmailVerification($request->session()->get('email_verification_token'));
            } elseif (is_null($user->email_verified_at)) {
                // resend and message
                UserVerification::create(['user_id' => $user->id, 'token' => UserService::generateToken($user) ]);
                $user->notify(new EmailVerification());
                // logout
                Auth::logout();
                $request->session()->invalidate();
                $response = ['need_vefification' => 1];
            }


            $request->session()->regenerate();

            return response()->json( $response );
        } else {
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
        $response = [];

        if (Auth::check()) {
            $response['logged_in'] = 1;

            if (Auth::user()->email_verified_at) {
                $response['email_verified'] = 1;
            }
        } else {
            $response['not_logged_id'] = 1;
        }

        return response()->json($response);
    }

    public function verifyEmail(Request $request)
    {
        $validated = $request->validate([
            'token' => ['required', 'string', 'max:255'],
        ]);

        // store in session if exists
        if (!is_null(UserVerification::where('token', $validated['token'])->first())) {
            $request->session()->put('email_verification_token', $validated['token']);
            return response(['success' => 1]);
        }

        return response([]);
    }

    private function userEmailVerification($token)
    {
        $return =  false;
        $user = auth()->user();

        $validVerification = UserVerification::where('user_id', $user->id)
            ->where('updated_at', '>', Carbon::now()->subDay()->format('Y-m-d H:i:s'))->where('token', $token)
            ->first();

        if (!is_null($validVerification)) {

            $user->email_verified_at =  Carbon::now();
            $user->save();

            $validVerification->delete();
            $return = true;
        }

        return $return;
    }
}
