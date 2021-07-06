<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\UserVerification;
use Carbon\Carbon;

class VerificationController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'token' => ['required', 'string', 'max:255'],
        ]);

        $response = [];
        if (Auth::check()) {
            $user = $request->user();
            $response['logged_in'] = 1;

            $validVerification = UserVerification::where('user_id', $user->id)
                ->where('updated_at', '>', Carbon::now()->subDay()->format('Y-m-d H:i:s'))->where('token', $validated['token'])
                ->first();

            if (!is_null($validVerification)) {
                $user->update(['email_verified_at', Carbon::now()]);
                $validVerification->delete();

                $response['verified'] = 1;
            }
        }else{
            $request->session()->put('email_verification_token', $validated['token']);
        }

        return response()->json($response);
    }

    public function resend()
    {

    }
}
