<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserAccountRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function getUser(Request $request)
    {
        $user = auth()->user();
        $user->created = $user->created_at->format('Y-m-d H:i');
        return response($user->only('name', 'email','created'));
    }

    public function update(UserAccountRequest $request)
    {
        $user = auth()->user();
        $user->name = $request->name;
        $user->email = $request->email;

        if (!is_null($request->password)) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        return response(['success' => true]);
    }
}
